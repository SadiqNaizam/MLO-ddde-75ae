import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { toast } from "sonner";

import Header from '@/components/layout/Header';
import CollapsibleSidebar from '@/components/layout/CollapsibleSidebar';
import Footer from '@/components/layout/Footer';

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { ScrollArea } from '@/components/ui/scroll-area';

// Form Schemas and Types
const profileFormSchema = z.object({
  fullName: z.string().min(2, { message: "Full name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  phoneNumber: z.string().optional(),
  address: z.string().optional(),
});
type ProfileFormValues = z.infer<typeof profileFormSchema>;

const passwordFormSchema = z.object({
  currentPassword: z.string().min(8, { message: "Password must be at least 8 characters." }),
  newPassword: z.string().min(8, { message: "New password must be at least 8 characters." }),
  confirmPassword: z.string().min(8, { message: "Confirm password must be at least 8 characters." }),
}).refine(data => data.newPassword === data.confirmPassword, {
  message: "New passwords do not match.",
  path: ["confirmPassword"],
});
type PasswordFormValues = z.infer<typeof passwordFormSchema>;

const notificationSettingsSchema = z.object({
  transactionEmails: z.boolean().default(true),
  securityAlertsPush: z.boolean().default(true),
  promotionalOffers: z.boolean().default(false),
  newsletterSubscription: z.boolean().default(false),
});
type NotificationSettingsValues = z.infer<typeof notificationSettingsSchema>;


// Profile Form Component
const ProfileSettingsForm: React.FC = () => {
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      fullName: "Jane Doe",
      email: "jane.doe@example.com",
      phoneNumber: "555-0102",
      address: "123 Banking St, Finance City, FC 12345",
    },
  });

  function onSubmit(data: ProfileFormValues) {
    console.log("Profile settings submitted:", data);
    toast.success("Profile updated successfully!");
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="fullName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full Name</FormLabel>
              <FormControl>
                <Input placeholder="Your full name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email Address</FormLabel>
              <FormControl>
                <Input type="email" placeholder="your.email@example.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="phoneNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phone Number (Optional)</FormLabel>
              <FormControl>
                <Input placeholder="Your phone number" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
         <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Address (Optional)</FormLabel>
              <FormControl>
                <Input placeholder="Your address" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Save Profile</Button>
      </form>
    </Form>
  );
};

// Password Form Component
const PasswordSettingsForm: React.FC = () => {
  const form = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordFormSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  function onSubmit(data: PasswordFormValues) {
    console.log("Password change submitted:", data);
    toast.success("Password updated successfully!");
    form.reset(); // Clear form after submission
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="currentPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Current Password</FormLabel>
              <FormControl>
                <Input type="password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="newPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>New Password</FormLabel>
              <FormControl>
                <Input type="password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirm New Password</FormLabel>
              <FormControl>
                <Input type="password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Update Password</Button>
      </form>
    </Form>
  );
};

// Notification Settings Form Component
const NotificationSettingsForm: React.FC = () => {
    const form = useForm<NotificationSettingsValues>({
        resolver: zodResolver(notificationSettingsSchema),
        defaultValues: {
            transactionEmails: true,
            securityAlertsPush: true,
            promotionalOffers: false,
            newsletterSubscription: false,
        },
    });

    function onSubmit(data: NotificationSettingsValues) {
        console.log("Notification settings submitted:", data);
        toast.success("Notification preferences saved!");
    }
    
    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <FormField
                    control={form.control}
                    name="transactionEmails"
                    render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                                <FormLabel className="text-base">Transaction Emails</FormLabel>
                                <FormDescription>Receive email notifications for account transactions.</FormDescription>
                            </div>
                            <FormControl>
                                <Switch checked={field.value} onCheckedChange={field.onChange} />
                            </FormControl>
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="securityAlertsPush"
                    render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                                <FormLabel className="text-base">Security Alerts (Push)</FormLabel>
                                <FormDescription>Get push notifications for important security alerts.</FormDescription>
                            </div>
                            <FormControl>
                                <Switch checked={field.value} onCheckedChange={field.onChange} />
                            </FormControl>
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="promotionalOffers"
                    render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                                <FormLabel className="text-base">Promotional Offers</FormLabel>
                                <FormDescription>Receive emails about new products and special offers.</FormDescription>
                            </div>
                            <FormControl>
                                <Switch checked={field.value} onCheckedChange={field.onChange} />
                            </FormControl>
                        </FormItem>
                    )}
                />
                 <FormField
                    control={form.control}
                    name="newsletterSubscription"
                    render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                                <FormLabel className="text-base">Newsletter Subscription</FormLabel>
                                <FormDescription>Subscribe to our monthly finance newsletter.</FormDescription>
                            </div>
                            <FormControl>
                                <Switch checked={field.value} onCheckedChange={field.onChange} />
                            </FormControl>
                        </FormItem>
                    )}
                />
                <Button type="submit">Save Preferences</Button>
            </form>
        </Form>
    );
};


const SettingsPage = () => {
  console.log('SettingsPage loaded');
  const [isMfaEnabled, setIsMfaEnabled] = useState(false);

  return (
    <div className="flex flex-col min-h-screen bg-muted/40 dark:bg-background">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <CollapsibleSidebar />
        <main className="flex-1 ml-64 overflow-y-auto"> {/* ml-64 for expanded sidebar width (w-64). Adjust if sidebar width changes or state is known */}
          <ScrollArea className="h-full">
            <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8 max-w-4xl">
              <h1 className="text-3xl font-bold tracking-tight text-foreground mb-8">
                Settings
              </h1>
              <Tabs defaultValue="profile" className="w-full">
                <TabsList className="grid w-full grid-cols-1 sm:grid-cols-3 mb-6">
                  <TabsTrigger value="profile">Profile</TabsTrigger>
                  <TabsTrigger value="security">Security</TabsTrigger>
                  <TabsTrigger value="notifications">Notifications</TabsTrigger>
                </TabsList>

                <TabsContent value="profile">
                  <Card>
                    <CardHeader>
                      <CardTitle>Personal Information</CardTitle>
                      <CardDescription>
                        Manage your personal details and contact information.
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ProfileSettingsForm />
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="security">
                  <div className="space-y-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>Change Password</CardTitle>
                        <CardDescription>
                          Choose a strong password and update it regularly.
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <PasswordSettingsForm />
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle>Multi-Factor Authentication (MFA)</CardTitle>
                        <CardDescription>
                          Add an extra layer of security to your account.
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="flex items-center justify-between">
                        <Label htmlFor="mfa-switch" className="text-sm font-medium">
                          {isMfaEnabled ? "MFA Enabled" : "MFA Disabled"}
                        </Label>
                        <Switch
                          id="mfa-switch"
                          checked={isMfaEnabled}
                          onCheckedChange={() => {
                            setIsMfaEnabled(!isMfaEnabled);
                            toast.info(`MFA ${!isMfaEnabled ? "enabled" : "disabled"}. (Demo only)`);
                          }}
                        />
                      </CardContent>
                      <CardFooter>
                        <p className="text-xs text-muted-foreground">
                            {isMfaEnabled ? "You are using an additional security layer." : "Consider enabling MFA for enhanced account protection."}
                        </p>
                      </CardFooter>
                    </Card>

                    <Accordion type="single" collapsible className="w-full">
                      <AccordionItem value="login-history">
                        <AccordionTrigger>Login History</AccordionTrigger>
                        <AccordionContent>
                          <p className="text-sm text-muted-foreground">
                            This section would display a list of recent login attempts, including date, time, IP address, and location.
                            (Placeholder content)
                          </p>
                          <ul className="mt-2 space-y-1 text-xs text-muted-foreground list-disc list-inside">
                            <li>01/08/2024, 10:00 AM - New York, USA (IP: 192.168.1.10) - Success</li>
                            <li>31/07/2024, 02:30 PM - London, UK (IP: 10.0.0.5) - Success</li>
                          </ul>
                        </AccordionContent>
                      </AccordionItem>
                      <AccordionItem value="connected-devices">
                        <AccordionTrigger>Connected Devices</AccordionTrigger>
                        <AccordionContent>
                          <p className="text-sm text-muted-foreground">
                            Manage devices that are authorized to access your account.
                            (Placeholder content)
                          </p>
                           <ul className="mt-2 space-y-1 text-xs text-muted-foreground list-disc list-inside">
                            <li>iPhone 15 Pro - Last accessed: 01/08/2024 <Button variant="link" size="sm" className="h-auto p-0 ml-2">Revoke</Button></li>
                            <li>Chrome on Windows - Last accessed: 30/07/2024 <Button variant="link" size="sm" className="h-auto p-0 ml-2">Revoke</Button></li>
                          </ul>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  </div>
                </TabsContent>

                <TabsContent value="notifications">
                  <Card>
                    <CardHeader>
                      <CardTitle>Notification Preferences</CardTitle>
                      <CardDescription>
                        Choose how you want to be notified about account activity and updates.
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <NotificationSettingsForm />
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </ScrollArea>
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default SettingsPage;