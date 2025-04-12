import type { ReactNode } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface AccentCardProps {
  className?: string;
  title?: string | ReactNode;
  description?: string | ReactNode;
  children: ReactNode;
  footer?: ReactNode;
  headerClassName?: string;
  contentClassName?: string;
  footerClassName?: string;
}

export function AccentCard({
  className,
  title,
  description,
  children,
  footer,
  headerClassName,
  contentClassName,
  footerClassName,
}: AccentCardProps) {
  return (
    <motion.div
      className="relative"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      {/* Glow effects */}
      <motion.div
        className="absolute -top-10 -left-10 w-40 h-40 rounded-full bg-primary/5 blur-xl"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.5, 0.8, 0.5],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="absolute -bottom-10 -right-10 w-40 h-40 rounded-full bg-primary/5 blur-xl"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.5, 0.8, 0.5],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1,
        }}
      />

      <Card
        className={cn(
          "border-none shadow-lg relative overflow-hidden",
          className
        )}
      >
        {/* Accent elements */}
        <motion.div
          className="absolute top-0 left-0 w-full h-1 bg-primary"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        />
        <motion.div
          className="absolute top-0 right-0 w-24 h-24 -translate-y-1/2 translate-x-1/2 rounded-full bg-primary/10"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        />
        <motion.div
          className="absolute bottom-0 left-0 w-16 h-16 translate-y-1/3 -translate-x-1/3 rounded-full bg-primary/10"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        />

        {/* Card content */}
        {(title || description) && (
          <CardHeader className={cn("pb-6 relative z-10", headerClassName)}>
            {title &&
              (typeof title === "string" ? (
                <CardTitle className="text-2xl md:text-3xl font-bold text-center">
                  {title}
                </CardTitle>
              ) : (
                title
              ))}
            {description &&
              (typeof description === "string" ? (
                <CardDescription className="text-muted-foreground text-center mt-2">
                  {description}
                </CardDescription>
              ) : (
                description
              ))}
          </CardHeader>
        )}

        <CardContent className={cn("relative z-10", contentClassName)}>
          {children}
        </CardContent>

        {footer && (
          <CardFooter className={cn("relative z-10", footerClassName)}>
            {footer}
          </CardFooter>
        )}
      </Card>
    </motion.div>
  );
}
