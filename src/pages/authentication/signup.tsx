import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Eye, EyeOff, Loader2, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useSignupForm } from "@/components/authentication/signup-form";

export default function SignupForm() {
  const {
    formData,
    showPassword,
    setShowPassword,
    errors,
    isSubmitting,
    success,
    handleChange,
    handleSubmit,
    checkPasswordRequirement,
    passwordRequirements,
    containerVariants,
    itemVariants,
  } = useSignupForm();

  if (success) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="max-w-md mx-auto p-8 rounded-xl bg-background shadow-lg border border-border text-center"
      >
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Check className="h-8 w-8 text-green-600" />
        </div>
        <h2 className="text-2xl font-bold mb-2">Account Created!</h2>
        <p className="text-muted-foreground mb-6">
          Redirecting you to your dashboard...
        </p>
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div
            className="bg-primary h-2.5 rounded-full animate-pulse"
            style={{ width: "100%" }}
          />
        </div>
      </motion.div>
    );
  }
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="max-w-md mx-auto p-8 rounded-xl bg-background shadow-lg border border-border"
    >
      <motion.div variants={itemVariants} className="text-center mb-8">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent mb-2">
          Create Account
        </h1>
      </motion.div>

      {errors.form && (
        <motion.div
          variants={itemVariants}
          className="mb-4 p-3 text-sm text-red-600 bg-red-50 rounded-lg flex items-start"
        >
          <X className="h-4 w-4 mt-0.5 mr-2 flex-shrink-0" />
          <span>{errors.form}</span>
        </motion.div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <motion.div variants={itemVariants} className="space-y-2">
            <Label htmlFor="firstName">First Name</Label>
            <Input
              id="firstName"
              type="text"
              placeholder="John"
              value={formData.firstName}
              onChange={handleChange}
              className={`py-5 px-4 ${
                errors.firstName ? "border-red-500" : ""
              }`}
            />
            {errors.firstName && (
              <p className="text-sm text-red-500">{errors.firstName}</p>
            )}
          </motion.div>

          <motion.div variants={itemVariants} className="space-y-2">
            <Label htmlFor="lastName">Last Name</Label>
            <Input
              id="lastName"
              type="text"
              placeholder="Doe"
              value={formData.lastName}
              onChange={handleChange}
              className={`py-5 px-4 ${errors.lastName ? "border-red-500" : ""}`}
            />
            {errors.lastName && (
              <p className="text-sm text-red-500">{errors.lastName}</p>
            )}
          </motion.div>
        </div>

        {/* Added Username Field */}
        <motion.div variants={itemVariants} className="space-y-2">
          <Label htmlFor="username">Username</Label>
          <Input
            id="username"
            type="text"
            placeholder="cooluser123"
            value={formData.username}
            onChange={handleChange}
            className={`py-5 px-4 ${errors.username ? "border-red-500" : ""}`}
          />
          {errors.username && (
            <p className="text-sm text-red-500">{errors.username}</p>
          )}
        </motion.div>

        <motion.div variants={itemVariants} className="space-y-2">
          <Label htmlFor="email">Email Address</Label>
          <Input
            id="email"
            type="email"
            placeholder="you@example.com"
            value={formData.email}
            onChange={handleChange}
            className={`py-5 px-4 ${errors.email ? "border-red-500" : ""}`}
          />
          {errors.email && (
            <p className="text-sm text-red-500">{errors.email}</p>
          )}
        </motion.div>

        <motion.div variants={itemVariants} className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              className={`py-5 px-4 pr-10 ${
                errors.password ? "border-red-500" : ""
              }`}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-primary"
            >
              {showPassword ? (
                <EyeOff className="h-5 w-5" />
              ) : (
                <Eye className="h-5 w-5" />
              )}
            </button>
          </div>
          <div className="mt-2 space-y-1">
            {passwordRequirements.map((req) => (
              <div key={req.id} className="flex items-center text-sm">
                {checkPasswordRequirement(req.regex) ? (
                  <Check className="h-4 w-4 text-green-500 mr-2" />
                ) : (
                  <div className="h-4 w-4 rounded-full border border-gray-300 mr-2"></div>
                )}
                <span
                  className={
                    checkPasswordRequirement(req.regex)
                      ? "text-green-500"
                      : "text-muted-foreground"
                  }
                >
                  {req.text}
                </span>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="space-y-2">
          <Label htmlFor="confirmPassword">Confirm Password</Label>
          <Input
            id="confirmPassword"
            type={showPassword ? "text" : "password"}
            placeholder="••••••••"
            value={formData.confirmPassword}
            onChange={handleChange}
            className={`py-5 px-4 ${
              errors.confirmPassword ? "border-red-500" : ""
            }`}
          />
          {errors.confirmPassword && (
            <p className="text-sm text-red-500">{errors.confirmPassword}</p>
          )}
        </motion.div>

        <motion.div variants={itemVariants} className="pt-2">
          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-5 rounded-lg bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating Account...
              </>
            ) : (
              "Sign Up"
            )}
          </Button>
        </motion.div>
      </form>

      <motion.div variants={itemVariants} className="mt-6 text-center text-sm">
        <span className="text-muted-foreground">Already have an account? </span>
        <Link to="/login" className="font-medium text-primary hover:underline">
          Sign in
        </Link>
      </motion.div>
    </motion.div>
  );
}
