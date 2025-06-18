import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { format } from 'date-fns'; // date-fns is not in dependencies, so using toLocaleDateString instead.

import Header from '@/components/layout/Header';
import CollapsibleSidebar from '@/components/layout/CollapsibleSidebar';
import Footer from '@/components/layout/Footer';

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "@/components/ui/use-toast"; // Using shadcn toast
import { Calendar as CalendarIcon, PlusCircle, Trash2 } from 'lucide-react';

// Schemas for form validation
const transferFormSchema = z.object({
  fromAccount: z.string().min(1, "Please select a source account."),
  transferType: z.enum(["myAccount", "externalRecipient"], { required_error: "Please select transfer type."}),
  toMyAccount: z.string().optional(),
  toExternalRecipientName: z.string().optional(),
  toExternalRecipientAccount: z.string().optional(),
  amount: z.coerce.number().positive({ message: "Amount must be a positive number." }),
  date: z.date({ required_error: "Please select a transfer date." }),
  memo: z.string().max(100, "Memo can be up to 100 characters.").optional(),
  isRecurring: z.boolean().optional(),
}).refine(data => {
    if (data.transferType === "myAccount" && !data.toMyAccount) return false;
    return true;
}, { message: "Please select a destination account.", path: ["toMyAccount"] })
.refine(data => {
    if (data.transferType === "externalRecipient" && (!data.toExternalRecipientName || !data.toExternalRecipientAccount)) return false;
    return true;
}, { message: "Recipient name and account are required for external transfers.", path: ["toExternalRecipientName"] });


const billPayFormSchema = z.object({
  payee: z.string().min(1, "Please select a payee."),
  fromAccount: z.string().min(1, "Please select a source account."),
  amount: z.coerce.number().positive({ message: "Amount must be a positive number." }),
  paymentDate: z.date({ required_error: "Please select a payment date." }),
  frequency: z.enum(["one-time", "monthly", "weekly"], { required_error: "Please select payment frequency."}),
  notes: z.string().max(100, "Notes can be up to 100 characters.").optional(),
});

const MoveMoneyPage = () => {
  console.log('MoveMoneyPage loaded');

  const [activeTab, setActiveTab] = useState('transfers');

  // Sample data
  const accounts = [
    { id: 'acc1', name: 'Primary Checking - xxxx1234', balance: 5250.75 },
    { id: 'acc2', name: 'High-Yield Savings - xxxx5678', balance: 10120.20 },
    { id: 'acc3', name: 'Business Account - xxxx9012', balance: 25300.00 },
  ];

  const [payees, setPayees] = useState([
    { id: 'payee1', name: 'City Electric Co.' },
    { id: 'payee2', name: 'Water Services Inc.' },
    { id: 'payee3', name: 'Internet Provider Plus' },
  ]);

  const [scheduledPayments, setScheduledPayments] = useState([
    { id: 'sch1', payee: 'City Electric Co.', amount: 75.00, date: '2024-09-15', account: 'Primary Checking - xxxx1234', status: 'Scheduled' },
    { id: 'sch2', payee: 'Internet Provider Plus', amount: 60.00, date: '2024-09-20', account: 'Primary Checking - xxxx1234', status: 'Scheduled' },
  ]);
  
  // React Hook Form setup
  const transferForm = useForm<z.infer<typeof transferFormSchema>>({
    resolver: zodResolver(transferFormSchema),
    defaultValues: {
      fromAccount: "",
      transferType: "myAccount",
      toMyAccount: "",
      toExternalRecipientName: "",
      toExternalRecipientAccount: "",
      amount: 0,
      memo: "",
      isRecurring: false,
    },
  });

  const billPayForm = useForm<z.infer<typeof billPayFormSchema>>({
    resolver: zodResolver(billPayFormSchema),
    defaultValues: {
      payee: "",
      fromAccount: "",
      amount: 0,
      frequency: "one-time",
      notes: "",
    },
  });

  function onTransferSubmit(values: z.infer<typeof transferFormSchema>) {
    console.log('Transfer Submitted:', values);
    toast({
      title: "Transfer Initiated",
      description: `Transfer of $${values.amount} scheduled.`,
    });
    transferForm.reset();
  }

  function onBillPaySubmit(values: z.infer<typeof billPayFormSchema>) {
    console.log('Bill Pay Submitted:', values);
    const newPayment = { 
        id: `sch${scheduledPayments.length + 1}`, 
        payee: payees.find(p => p.id === values.payee)?.name || 'Unknown Payee', 
        amount: values.amount, 
        date: values.paymentDate.toISOString().split('T')[0], // Format date as YYYY-MM-DD
        account: accounts.find(a => a.id === values.fromAccount)?.name || 'Unknown Account', 
        status: 'Scheduled'
    };
    setScheduledPayments(prev => [...prev, newPayment]);
    toast({
      title: "Payment Scheduled",
      description: `Payment of $${values.amount} to ${newPayment.payee} scheduled.`,
    });
    billPayForm.reset();
  }
  
  const selectedTransferType = transferForm.watch("transferType");

  return (
    <div className="flex min-h-screen bg-background">
      <CollapsibleSidebar />
      {/* Assuming expanded sidebar width of w-64 (256px). Adjust ml-64 if sidebar width changes. */}
      <div className="flex flex-col flex-1 ml-64 min-w-0"> 
        <Header />
        <main className="flex-1 p-6 md:p-8 lg:p-10 overflow-y-auto bg-muted/40">
          <div className="max-w-5xl mx-auto"> {/* Increased max-width for more space */}
            <div className="flex items-center justify-between mb-8">
              <h1 className="text-3xl font-bold text-foreground">Move Money</h1>
            </div>

            <Tabs defaultValue="transfers" className="w-full" onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-2 md:w-[400px] mb-6 bg-muted p-1 rounded-lg">
                <TabsTrigger value="transfers" className="data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm">Transfers</TabsTrigger>
                <TabsTrigger value="billpay" className="data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm">Bill Pay</TabsTrigger>
              </TabsList>

              {/* Transfers Tab Content */}
              <TabsContent value="transfers">
                <Card>
                  <CardHeader>
                    <CardTitle>Make a Transfer</CardTitle>
                    <CardDescription>Transfer funds between your accounts or to other recipients.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Form {...transferForm}>
                      <form onSubmit={transferForm.handleSubmit(onTransferSubmit)} className="space-y-6">
                        <FormField
                          control={transferForm.control}
                          name="fromAccount"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>From Account</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger><SelectValue placeholder="Select source account" /></SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {accounts.map(acc => <SelectItem key={acc.id} value={acc.id}>{acc.name} (${acc.balance.toFixed(2)})</SelectItem>)}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={transferForm.control}
                          name="transferType"
                          render={({ field }) => (
                            <FormItem className="space-y-3">
                              <FormLabel>Transfer To</FormLabel>
                              <FormControl>
                                <RadioGroup
                                  onValueChange={field.onChange}
                                  defaultValue={field.value}
                                  className="flex flex-col space-y-1 md:flex-row md:space-y-0 md:space-x-4"
                                >
                                  <FormItem className="flex items-center space-x-3 space-y-0">
                                    <FormControl><RadioGroupItem value="myAccount" /></FormControl>
                                    <FormLabel className="font-normal">My Accounts</FormLabel>
                                  </FormItem>
                                  <FormItem className="flex items-center space-x-3 space-y-0">
                                    <FormControl><RadioGroupItem value="externalRecipient" /></FormControl>
                                    <FormLabel className="font-normal">External Recipient (P2P/ACH)</FormLabel>
                                  </FormItem>
                                </RadioGroup>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        {selectedTransferType === "myAccount" && (
                          <FormField
                            control={transferForm.control}
                            name="toMyAccount"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>To Account (My Accounts)</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                  <FormControl>
                                    <SelectTrigger><SelectValue placeholder="Select destination account" /></SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    {accounts.map(acc => <SelectItem key={acc.id} value={acc.id}>{acc.name} (${acc.balance.toFixed(2)})</SelectItem>)}
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        )}

                        {selectedTransferType === "externalRecipient" && (
                          <>
                            <FormField
                              control={transferForm.control}
                              name="toExternalRecipientName"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Recipient Name</FormLabel>
                                  <FormControl><Input placeholder="John Doe" {...field} /></FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={transferForm.control}
                              name="toExternalRecipientAccount"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Recipient Account Number / Email / Phone</FormLabel>
                                  <FormControl><Input placeholder="Account number or P2P identifier" {...field} /></FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </>
                        )}

                        <FormField
                          control={transferForm.control}
                          name="amount"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Amount</FormLabel>
                              <FormControl><Input type="number" placeholder="0.00" {...field} /></FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={transferForm.control}
                          name="date"
                          render={({ field }) => (
                            <FormItem className="flex flex-col">
                              <FormLabel>Transfer Date</FormLabel>
                              <Popover>
                                <PopoverTrigger asChild>
                                  <FormControl>
                                    <Button variant={"outline"} className={`w-full pl-3 text-left font-normal ${!field.value && "text-muted-foreground"}`}>
                                      {field.value ? field.value.toLocaleDateString() : <span>Pick a date</span>}
                                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                    </Button>
                                  </FormControl>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0" align="start">
                                  <Calendar mode="single" selected={field.value} onSelect={field.onChange} disabled={(date) => date < new Date(new Date().setHours(0,0,0,0))} initialFocus />
                                </PopoverContent>
                              </Popover>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={transferForm.control}
                          name="memo"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Memo (Optional)</FormLabel>
                              <FormControl><Textarea placeholder="Optional notes for your transfer" {...field} /></FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                            control={transferForm.control}
                            name="isRecurring"
                            render={({ field }) => (
                                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 shadow">
                                <FormControl>
                                    <Checkbox
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                    />
                                </FormControl>
                                <div className="space-y-1 leading-none">
                                    <FormLabel>Make this a recurring transfer?</FormLabel>
                                    <FormDescription>
                                    Set up this transfer to repeat automatically. (Further options would appear here)
                                    </FormDescription>
                                </div>
                                </FormItem>
                            )}
                        />
                        <Button type="submit" className="w-full md:w-auto">Initiate Transfer</Button>
                      </form>
                    </Form>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Bill Pay Tab Content */}
              <TabsContent value="billpay">
                <Card>
                  <CardHeader>
                    <CardTitle>Pay a Bill</CardTitle>
                    <CardDescription>Select a payee, amount, and date to schedule your payment.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Form {...billPayForm}>
                      <form onSubmit={billPayForm.handleSubmit(onBillPaySubmit)} className="space-y-6">
                        <FormField
                          control={billPayForm.control}
                          name="payee"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Payee</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger><SelectValue placeholder="Select payee" /></SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {payees.map(p => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={billPayForm.control}
                          name="fromAccount"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>From Account</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger><SelectValue placeholder="Select source account" /></SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {accounts.map(acc => <SelectItem key={acc.id} value={acc.id}>{acc.name} (${acc.balance.toFixed(2)})</SelectItem>)}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={billPayForm.control}
                          name="amount"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Amount</FormLabel>
                              <FormControl><Input type="number" placeholder="0.00" {...field} /></FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={billPayForm.control}
                          name="paymentDate"
                          render={({ field }) => (
                            <FormItem className="flex flex-col">
                              <FormLabel>Payment Date</FormLabel>
                              <Popover>
                                <PopoverTrigger asChild>
                                  <FormControl>
                                    <Button variant={"outline"} className={`w-full pl-3 text-left font-normal ${!field.value && "text-muted-foreground"}`}>
                                      {field.value ? field.value.toLocaleDateString() : <span>Pick a date</span>}
                                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                    </Button>
                                  </FormControl>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0" align="start">
                                  <Calendar mode="single" selected={field.value} onSelect={field.onChange} disabled={(date) => date < new Date(new Date().setHours(0,0,0,0))} initialFocus />
                                </PopoverContent>
                              </Popover>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                         <FormField
                            control={billPayForm.control}
                            name="frequency"
                            render={({ field }) => (
                                <FormItem className="space-y-3">
                                <FormLabel>Frequency</FormLabel>
                                <FormControl>
                                    <RadioGroup
                                    onValueChange={field.onChange}
                                    defaultValue={field.value}
                                    className="flex flex-col space-y-1 md:flex-row md:space-y-0 md:space-x-4"
                                    >
                                    <FormItem className="flex items-center space-x-3 space-y-0">
                                        <FormControl><RadioGroupItem value="one-time" /></FormControl>
                                        <FormLabel className="font-normal">One-Time</FormLabel>
                                    </FormItem>
                                    <FormItem className="flex items-center space-x-3 space-y-0">
                                        <FormControl><RadioGroupItem value="monthly" /></FormControl>
                                        <FormLabel className="font-normal">Monthly</FormLabel>
                                    </FormItem>
                                    <FormItem className="flex items-center space-x-3 space-y-0">
                                        <FormControl><RadioGroupItem value="weekly" /></FormControl>
                                        <FormLabel className="font-normal">Weekly</FormLabel>
                                    </FormItem>
                                    </RadioGroup>
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                          control={billPayForm.control}
                          name="notes"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Notes (Optional)</FormLabel>
                              <FormControl><Textarea placeholder="Optional notes for this bill payment" {...field} /></FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <Button type="submit" className="w-full md:w-auto">Schedule Payment</Button>
                      </form>
                    </Form>
                  </CardContent>
                </Card>

                <Card className="mt-8">
                  <CardHeader>
                    <CardTitle>Scheduled Payments</CardTitle>
                    <CardDescription>View and manage your upcoming bill payments.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {scheduledPayments.length > 0 ? (
                        <Table>
                        <TableHeader>
                            <TableRow>
                            <TableHead>Payee</TableHead>
                            <TableHead>Amount</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead>From Account</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {scheduledPayments.map((payment) => (
                            <TableRow key={payment.id}>
                                <TableCell>{payment.payee}</TableCell>
                                <TableCell>${payment.amount.toFixed(2)}</TableCell>
                                <TableCell>{payment.date}</TableCell>
                                <TableCell>{payment.account}</TableCell>
                                <TableCell><span className="px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800">{payment.status}</span></TableCell>
                                <TableCell className="text-right">
                                    <Button variant="ghost" size="icon" onClick={() => {
                                        setScheduledPayments(prev => prev.filter(p => p.id !== payment.id));
                                        toast({ title: "Payment Cancelled", description: `Payment to ${payment.payee} cancelled.`});
                                    }}>
                                        <Trash2 className="h-4 w-4" />
                                        <span className="sr-only">Cancel Payment</span>
                                    </Button>
                                </TableCell>
                            </TableRow>
                            ))}
                        </TableBody>
                        </Table>
                    ) : (
                        <p className="text-sm text-muted-foreground">No scheduled payments at this time.</p>
                    )}
                  </CardContent>
                </Card>

                <Card className="mt-8">
                  <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                        <CardTitle>Manage Payees</CardTitle>
                        <CardDescription>Add, edit, or remove your bill payees.</CardDescription>
                    </div>
                    <Button size="sm" onClick={() => alert("Add new payee functionality to be implemented.")}><PlusCircle className="mr-2 h-4 w-4"/> Add New Payee</Button>
                  </CardHeader>
                  <CardContent>
                    {payees.length > 0 ? (
                        <Table>
                        <TableHeader>
                            <TableRow>
                            <TableHead>Payee Name</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {payees.map((payee) => (
                            <TableRow key={payee.id}>
                                <TableCell>{payee.name}</TableCell>
                                <TableCell className="text-right">
                                <Button variant="ghost" size="sm" onClick={() => alert(`Edit ${payee.name}`)} className="mr-2">Edit</Button>
                                <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive" onClick={() => {
                                    setPayees(prev => prev.filter(p => p.id !== payee.id));
                                    toast({ title: "Payee Removed", description: `${payee.name} has been removed.`});
                                }}>Remove</Button>
                                </TableCell>
                            </TableRow>
                            ))}
                        </TableBody>
                        </Table>
                    ) : (
                        <p className="text-sm text-muted-foreground">No payees found. Click "Add New Payee" to get started.</p>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </main>
        <Footer />
      </div>
    </div>
  );
};

export default MoveMoneyPage;