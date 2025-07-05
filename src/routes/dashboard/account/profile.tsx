import { createFileRoute, Link } from "@tanstack/react-router";
import { authClient } from "@/lib/auth-client";
import { redirect, useNavigate } from "@tanstack/react-router";
import { useTransition, useState } from "react";
import { UAParser } from "ua-parser-js";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Switch } from "@/components/ui/switch";
import {
  Calendar,
  Key,
  Laptop,
  Loader2,
  LogOut,
  Phone,
  Shield,
  Upload,
} from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { AccentCard } from "@/components/ui/accent-card";
import { getUserById, updateUser } from "@/utils/users";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import axios from "axios";

export const Route = createFileRoute("/dashboard/account/profile")({
  component: AccountPage,
  beforeLoad: async ({ context }) => {
    const { data } = await authClient.getSession(context);
    if (!data?.session || !data?.user) {
      return redirect({
        to: "/sign-in",
        params: { callbackURL: "/dashboard/account/profile" },
      });
    }
  },
  loader: async () => {
    const { data } = await authClient.getSession();
    const fullUserInfo = await getUserById(data?.user?.id);
    return {
      fullUserInfo,
      session: data?.session,
    };
  },
  errorComponent: ({ error }) => {
    const errorMsg = error.message ?? "An error occurred";
    return (
      <div className="flex h-full items-center justify-center">
        <div className="rounded-lg bg-red-50 p-6 text-red-700">
          <h2 className="text-lg font-bold">Error</h2>
          <p>{errorMsg}</p>
        </div>
      </div>
    );
  },
});

function AccountPage() {
  const { fullUserInfo, session } = Route.useLoaderData();
  const [isPending, startTransition] = useTransition();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [profileImagePreview, setProfileImagePreview] = useState<string | null>(
    null
  );

  const [formData, setFormData] = useState({
    name: fullUserInfo?.name || "",
    phone: fullUserInfo?.phone || "",
    country: fullUserInfo?.country || "",
    address: fullUserInfo?.address || "",
    postalCode: fullUserInfo?.postalCode || "",
    dateOfBirth: fullUserInfo?.dateOfBirth
      ? new Date(fullUserInfo.dateOfBirth).toISOString().split("T")[0]
      : "",
  });

  const deviceInfo = new UAParser(session?.userAgent ?? "");
  const isMobile = deviceInfo.getDevice().type === "mobile";
  const osName = deviceInfo.getOS().name;
  const browserName = deviceInfo.getBrowser().name;

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase();
  };

  const handleSignOut = () => {
    startTransition(async () => {
      await authClient.signOut({
        fetchOptions: {
          onSuccess: () => {
            navigate({ to: "/" });
          },
        },
      });
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSelectChange = (value: string, field: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setProfileImage(file);

      // Create a preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfileImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveChanges = () => {
    startTransition(async () => {
      try {
        // Update user profile information
        await updateUser(
          {
            ...formData,
            dateOfBirth: formData.dateOfBirth
              ? new Date(formData.dateOfBirth)
              : undefined,
          },
          fullUserInfo.id
        );

        // Upload profile image if changed
        if (profileImage) {
          const formData = new FormData();
          formData.append("image", profileImage);

          await axios.put(
            `https://server.resonantfinance.org/api/users/${fullUserInfo.id}/profile-picture`,
            formData,
            { withCredentials: true }
          );
        }

        // Refresh the page to show updated info
        navigate({ to: "/dashboard/account/profile" });
        setIsEditing(false);
        toast.success("Profile updated", {
          description:
            "Your profile information has been updated successfully.",
        });
      } catch (error) {
        console.error("Error updating profile:", error);
        toast.error("Update failed", {
          description:
            "There was an error updating your profile. Please try again.",
        });
      }
    });
  };

  return (
    <div className="w-full mt-10 grid place-content-center">
      <AccentCard className="container py-10 max-w-4xl mx-auto">
        {/* Page Header */}
        <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Account</h1>
            <p className="text-muted-foreground">
              Manage your account settings and preferences
            </p>
          </div>
          <Button
            variant="destructive"
            onClick={handleSignOut}
            disabled={isPending}
            className="shrink-0 cursor-pointer disabled:cursor-not-allowed"
          >
            {isPending ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <LogOut className="h-4 w-4 mr-2" />
            )}
            Sign out
          </Button>
        </div>

        {/* Tabs for different account sections */}
        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="grid grid-cols-3 md:grid-cols-4 mb-8">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
            <TabsTrigger value="sessions">Sessions</TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>
                  View and update your personal information
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex flex-col md:flex-row gap-6 items-start">
                  <div className="relative">
                    <Avatar className="h-24 w-24">
                      {profileImagePreview ? (
                        <AvatarImage
                          src={profileImagePreview}
                          alt={fullUserInfo?.name || ""}
                        />
                      ) : (
                        <AvatarImage
                          src={
                            fullUserInfo?.image
                              ? `/api/user/profile-picture/${fullUserInfo.image}`
                              : ""
                          }
                          alt={fullUserInfo?.name || ""}
                        />
                      )}
                      <AvatarFallback className="text-xl">
                        {getInitials(fullUserInfo?.name || "")}
                      </AvatarFallback>
                    </Avatar>

                    {isEditing && (
                      <div className="mt-2">
                        <Label
                          htmlFor="profileImage"
                          className="cursor-pointer flex items-center justify-center p-2 border rounded-md border-dashed text-sm text-muted-foreground hover:bg-muted"
                        >
                          <Upload className="h-4 w-4 mr-2" />
                          Change Photo
                        </Label>
                        <Input
                          id="profileImage"
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleImageChange}
                        />
                      </div>
                    )}
                  </div>

                  <div className="space-y-4 flex-1">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Full Name</Label>
                        <Input
                          id="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          readOnly={!isEditing}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          defaultValue={fullUserInfo?.email || ""}
                          readOnly
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input
                          id="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          readOnly={!isEditing}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="country">Country</Label>
                        {isEditing ? (
                          <Select
                            onValueChange={(value) =>
                              handleSelectChange(value, "country")
                            }
                            defaultValue={formData.country}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select a country" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="United States">
                                United States
                              </SelectItem>
                              <SelectItem value="United Kingdom">
                                United Kingdom
                              </SelectItem>
                              <SelectItem value="Canada">Canada</SelectItem>
                              <SelectItem value="Australia">
                                Australia
                              </SelectItem>
                              <SelectItem value="Germany">Germany</SelectItem>
                              <SelectItem value="France">France</SelectItem>
                              <SelectItem value="Japan">Japan</SelectItem>
                              <SelectItem value="China">China</SelectItem>
                              <SelectItem value="India">India</SelectItem>
                              <SelectItem value="Brazil">Brazil</SelectItem>
                            </SelectContent>
                          </Select>
                        ) : (
                          <Input
                            id="country"
                            value={formData.country}
                            readOnly
                          />
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="address">Address</Label>
                        <Input
                          id="address"
                          value={formData.address}
                          onChange={handleInputChange}
                          readOnly={!isEditing}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="postalCode">Postal Code</Label>
                        <Input
                          id="postalCode"
                          value={formData.postalCode}
                          onChange={handleInputChange}
                          readOnly={!isEditing}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="dateOfBirth">Date of Birth</Label>
                        <div className="relative">
                          <Input
                            id="dateOfBirth"
                            type="date"
                            value={formData.dateOfBirth}
                            onChange={handleInputChange}
                            readOnly={!isEditing}
                          />
                          {!isEditing && (
                            <Calendar className="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground" />
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button
                  variant="outline"
                  onClick={() => setIsEditing(!isEditing)}
                >
                  {isEditing ? "Cancel" : "Edit Profile"}
                </Button>
                {isEditing && (
                  <Button onClick={handleSaveChanges} disabled={isPending}>
                    {isPending ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      "Save Changes"
                    )}
                  </Button>
                )}
              </CardFooter>
            </Card>
          </TabsContent>

          {/* Security Tab */}
          <TabsContent value="security">
            <Card>
              <CardHeader>
                <CardTitle>Security Settings</CardTitle>
                <CardDescription>
                  Manage your account security and password
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <div className="flex items-center">
                        <Key className="h-4 w-4 mr-2" />
                        <h4 className="font-medium">Password</h4>
                      </div>
                      {/* <p className="text-sm text-muted-foreground">
                        Last changed 3 months ago
                      </p> */}
                    </div>
                    <Link to="/forgot-password">
                      <Button
                        variant="outline"
                        size="sm"
                        className="cursor-pointer"
                      >
                        Change Password
                      </Button>
                    </Link>
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <div className="flex items-center">
                        <Shield className="h-4 w-4 mr-2" />
                        <h4 className="font-medium">
                          Two-Factor Authentication
                        </h4>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Add an extra layer of security to your account
                      </p>
                    </div>
                    <Switch
                      defaultChecked={fullUserInfo?.twoFactorEnabled}
                      disabled={!isEditing}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Sessions Tab */}
          <TabsContent value="sessions">
            <Card>
              <CardHeader>
                <CardTitle>Active Sessions</CardTitle>
                <CardDescription>
                  Manage devices where you're currently logged in
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <Alert
                  variant="default"
                  className="bg-primary/5 border-primary/20"
                >
                  <div className="flex items-center gap-2">
                    {isMobile ? (
                      <Phone className="h-4 w-4" />
                    ) : (
                      <Laptop className="h-4 w-4" />
                    )}
                    <AlertTitle>Current Session</AlertTitle>
                  </div>
                  <AlertDescription className="mt-2 flex flex-col gap-1">
                    <span className="text-sm">
                      {osName}, {browserName}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      IP: {session?.ipAddress || "Unknown"} • Last active: Just
                      now
                    </span>
                  </AlertDescription>
                </Alert>

                <div className="space-y-4">
                  <h4 className="text-sm font-medium">Other Sessions</h4>
                  <div className="rounded-md border p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Laptop className="h-4 w-4" />
                        <div>
                          <p className="text-sm font-medium">Windows, Chrome</p>
                          <p className="text-xs text-muted-foreground">
                            IP: 192.168.1.1 • Last active: 2 days ago
                          </p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        Sign Out
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">
                  Sign Out From All Devices
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </AccentCard>
    </div>
  );
}
