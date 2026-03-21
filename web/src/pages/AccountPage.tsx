import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, User, Mail, Shield, Calendar, Edit2, Save, X, Lock, Key } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const AccountPage = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [is2FAEnabled, setIs2FAEnabled] = useState(false);
  const [is2FADialogOpen, setIs2FADialogOpen] = useState(false);
  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement profile update API call
    toast({
      title: "Profile Updated",
      description: "Your account information has been updated successfully.",
    });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData({
      name: user?.name || "",
      email: user?.email || "",
    });
    setIsEditing(false);
  };

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "New passwords do not match.",
      });
      return;
    }

    if (passwordData.newPassword.length < 6) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Password must be at least 6 characters long.",
      });
      return;
    }

    // TODO: Implement password change API call
    toast({
      title: "Password Changed",
      description: "Your password has been updated successfully.",
    });
    
    setPasswordData({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
    setIsPasswordDialogOpen(false);
  };

  const handleToggle2FA = () => {
    if (is2FAEnabled) {
      // Disable 2FA
      setIs2FAEnabled(false);
      toast({
        title: "2FA Disabled",
        description: "Two-factor authentication has been disabled.",
      });
    } else {
      // Enable 2FA
      setIs2FAEnabled(true);
      toast({
        title: "2FA Enabled",
        description: "Two-factor authentication has been enabled for your account.",
      });
      setIs2FADialogOpen(false);
    }
  };

  const handleDeleteAccount = () => {
    // TODO: Implement account deletion API call
    toast({
      variant: "destructive",
      title: "Account Deleted",
      description: "Your account has been permanently deleted.",
    });
    logout();
    navigate("/");
  };

  if (!user) {
    navigate("/login");
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-16 sm:pt-20 md:pt-24 pb-12 md:pb-16">
        <div className="container mx-auto px-3 sm:px-4 md:px-6">
          <div className="max-w-4xl mx-auto">
            {/* Back Button */}
            <div className="mb-4 md:mb-6">
              <Button
                onClick={() => navigate('/#home')}
                variant="outline"
                className="gap-2 text-xs sm:text-sm py-2 md:py-2.5 px-3 md:px-4 h-9 md:h-10 w-full sm:w-auto justify-center sm:justify-start"
              >
                <ArrowLeft className="w-3.5 h-3.5 md:w-4 md:h-4 flex-shrink-0" />
                Back to Home
              </Button>
            </div>

            {/* Page Header */}
            <div className="mb-6 sm:mb-8 md:mb-10 space-y-3 sm:space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gradient-to-br from-accent/20 to-accent/5 flex items-center justify-center flex-shrink-0">
                  <User className="w-7 h-7 sm:w-8 sm:h-8 text-accent" />
                </div>
                <div className="flex-1 min-w-0">
                  <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold break-words">
                    My <span className="gradient-text">Account</span>
                  </h1>
                  <p className="text-xs sm:text-sm md:text-base text-muted-foreground mt-1 sm:mt-2 break-words">
                    Manage your account settings and preferences
                  </p>
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {/* Sidebar */}
              <div className="space-y-4">
                <Card className="border-border hover:border-accent/50 transition-colors">
                  <CardHeader>
                    <CardTitle className="text-lg">Account Status</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Role</span>
                      <Badge
                        variant={user.role === "admin" ? "default" : "secondary"}
                        className={user.role === "admin" ? "bg-accent text-black" : ""}
                      >
                        {user.role === "admin" ? "Admin" : "User"}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Status</span>
                      <Badge variant="outline" className="border-green-500 text-green-500">
                        Active
                      </Badge>
                    </div>
                    <div className="flex items-start gap-2 pt-2">
                      <Calendar className="w-4 h-4 text-muted-foreground mt-0.5" />
                      <div className="flex-1">
                        <p className="text-xs text-muted-foreground">Member Since</p>
                        <p className="text-sm font-medium">
                          {new Date().toLocaleDateString("en-US", {
                            month: "long",
                            year: "numeric",
                          })}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between pt-4 mt-4 border-t border-border">
                      <span className="text-sm text-muted-foreground">2FA Status</span>
                      <Badge
                        variant={is2FAEnabled ? "default" : "outline"}
                        className={is2FAEnabled ? "bg-green-500 text-white" : ""}
                      >
                        {is2FAEnabled ? "Enabled" : "Disabled"}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>

                {user.role === "admin" && (
                  <Card className="border-border bg-gradient-to-br from-accent/5 to-transparent">
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Shield className="w-5 h-5 text-accent" />
                        Admin Access
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-4">
                        You have full administrative privileges.
                      </p>
                      <Button
                        onClick={() => navigate("/admin")}
                        className="w-full bg-accent hover:bg-accent/90"
                      >
                        Admin Dashboard
                      </Button>
                    </CardContent>
                  </Card>
                )}

                <Card className="border-border">
                  <CardHeader>
                    <CardTitle className="text-lg">Quick Links</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <Button
                      variant="ghost"
                      className="w-full justify-start"
                      onClick={() => navigate("/orders")}
                    >
                      My Orders
                    </Button>
                    <Button
                      variant="ghost"
                      className="w-full justify-start"
                      onClick={() => navigate("/#contact")}
                    >
                      Contact Support
                    </Button>
                  </CardContent>
                </Card>
              </div>

              {/* Main Content */}
              <div className="md:col-span-2 space-y-6">
                {/* Profile Information */}
                <Card className="border-border hover:border-accent/50 transition-colors">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle>Profile Information</CardTitle>
                        <CardDescription>
                          Update your personal details and contact information
                        </CardDescription>
                      </div>
                      {!isEditing && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setIsEditing(true)}
                          className="border-accent/50 hover:bg-accent/10"
                        >
                          <Edit2 className="w-4 h-4 mr-2" />
                          Edit
                        </Button>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Full Name</Label>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                          <Input
                            id="name"
                            value={formData.name}
                            onChange={(e) =>
                              setFormData({ ...formData, name: e.target.value })
                            }
                            disabled={!isEditing}
                            className="pl-10 bg-background border-border focus:border-accent"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="email">Email Address</Label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                          <Input
                            id="email"
                            type="email"
                            value={formData.email}
                            onChange={(e) =>
                              setFormData({ ...formData, email: e.target.value })
                            }
                            disabled={!isEditing}
                            className="pl-10 bg-background border-border focus:border-accent"
                          />
                        </div>
                      </div>

                      {isEditing && (
                        <div className="flex gap-3 pt-4">
                          <Button
                            type="submit"
                            className="flex-1 bg-accent hover:bg-accent/90"
                          >
                            <Save className="w-4 h-4 mr-2" />
                            Save Changes
                          </Button>
                          <Button
                            type="button"
                            variant="outline"
                            onClick={handleCancel}
                            className="flex-1"
                          >
                            <X className="w-4 h-4 mr-2" />
                            Cancel
                          </Button>
                        </div>
                      )}
                    </form>
                  </CardContent>
                </Card>

                {/* Security Settings */}
                <Card className="border-border hover:border-accent/50 transition-colors">
                  <CardHeader>
                    <CardTitle>Security Settings</CardTitle>
                    <CardDescription>
                      Manage your password and account security
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between py-3 border-b border-border">
                      <div>
                        <p className="font-medium">Password</p>
                        <p className="text-sm text-muted-foreground">
                          Last changed 2 months ago
                        </p>
                      </div>
                      <Dialog open={isPasswordDialogOpen} onOpenChange={setIsPasswordDialogOpen}>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm">
                            <Lock className="w-4 h-4 mr-2" />
                            Change Password
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Change Password</DialogTitle>
                            <DialogDescription>
                              Enter your current password and choose a new one
                            </DialogDescription>
                          </DialogHeader>
                          <form onSubmit={handlePasswordChange} className="space-y-4">
                            <div className="space-y-2">
                              <Label htmlFor="currentPassword">Current Password</Label>
                              <Input
                                id="currentPassword"
                                type="password"
                                value={passwordData.currentPassword}
                                onChange={(e) =>
                                  setPasswordData({
                                    ...passwordData,
                                    currentPassword: e.target.value,
                                  })
                                }
                                required
                                className="bg-background border-border focus:border-accent"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="newPassword">New Password</Label>
                              <Input
                                id="newPassword"
                                type="password"
                                value={passwordData.newPassword}
                                onChange={(e) =>
                                  setPasswordData({
                                    ...passwordData,
                                    newPassword: e.target.value,
                                  })
                                }
                                required
                                className="bg-background border-border focus:border-accent"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="confirmPassword">Confirm New Password</Label>
                              <Input
                                id="confirmPassword"
                                type="password"
                                value={passwordData.confirmPassword}
                                onChange={(e) =>
                                  setPasswordData({
                                    ...passwordData,
                                    confirmPassword: e.target.value,
                                  })
                                }
                                required
                                className="bg-background border-border focus:border-accent"
                              />
                            </div>
                            <div className="flex gap-3 pt-4">
                              <Button
                                type="submit"
                                className="flex-1 bg-accent hover:bg-accent/90"
                              >
                                Update Password
                              </Button>
                              <Button
                                type="button"
                                variant="outline"
                                onClick={() => setIsPasswordDialogOpen(false)}
                                className="flex-1"
                              >
                                Cancel
                              </Button>
                            </div>
                          </form>
                        </DialogContent>
                      </Dialog>
                    </div>
                    <div className="flex items-center justify-between py-3">
                      <div>
                        <p className="font-medium">Two-Factor Authentication</p>
                        <p className="text-sm text-muted-foreground">
                          Add an extra layer of security for your account
                        </p>
                      </div>
                      {is2FAEnabled ? (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleToggle2FA}
                          className="border-destructive text-destructive hover:bg-destructive/10"
                        >
                          Disable 2FA
                        </Button>
                      ) : (
                        <Dialog open={is2FADialogOpen} onOpenChange={setIs2FADialogOpen}>
                          <DialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              className="border-accent/50 hover:bg-accent/10"
                            >
                              <Key className="w-4 h-4 mr-2" />
                              Enable 2FA
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Enable Two-Factor Authentication</DialogTitle>
                              <DialogDescription>
                                Enhance your account security with 2FA
                              </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4 py-4">
                              <div className="bg-secondary/50 p-4 rounded-lg border border-border">
                                <h4 className="font-medium mb-2">What is 2FA?</h4>
                                <p className="text-sm text-muted-foreground">
                                  Two-factor authentication adds an extra layer of security by
                                  requiring both your password and a verification code to access
                                  your account.
                                </p>
                              </div>
                              <div className="bg-secondary/50 p-4 rounded-lg border border-border">
                                <h4 className="font-medium mb-2 flex items-center gap-2">
                                  <Shield className="w-4 h-4 text-accent" />
                                  Security Benefits
                                </h4>
                                <ul className="text-sm text-muted-foreground space-y-1 ml-6 list-disc">
                                  <li>Protect against unauthorized access</li>
                                  <li>Prevent account takeover</li>
                                  <li>Secure sensitive data and transactions</li>
                                </ul>
                              </div>
                              <p className="text-sm text-muted-foreground">
                                Once enabled, you'll receive a verification code via email
                                whenever you log in from a new device.
                              </p>
                            </div>
                            <div className="flex gap-3">
                              <Button
                                onClick={handleToggle2FA}
                                className="flex-1 bg-accent hover:bg-accent/90"
                              >
                                Enable 2FA
                              </Button>
                              <Button
                                variant="outline"
                                onClick={() => setIs2FADialogOpen(false)}
                                className="flex-1"
                              >
                                Cancel
                              </Button>
                            </div>
                          </DialogContent>
                        </Dialog>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Danger Zone */}
                <Card className="border-destructive/50 hover:border-destructive transition-colors">
                  <CardHeader>
                    <CardTitle className="text-destructive">Danger Zone</CardTitle>
                    <CardDescription>
                      Irreversible actions that will permanently affect your account
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="destructive" size="sm">
                          Delete Account
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete your
                            account and remove all your data from our servers.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={handleDeleteAccount}
                            className="bg-destructive hover:bg-destructive/90"
                          >
                            Delete Account
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default AccountPage;
