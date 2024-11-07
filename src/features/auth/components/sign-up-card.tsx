import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormMessage,
  FormItem,
} from "@/components/ui/form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
// import { Separator } from "@radix-ui/react-dropdown-menu";

import Link from "next/link";
import { useForm } from "react-hook-form";

const formSchema = z.object({
  name: z.string().min(5, "Required"),
  email: z.string().email(),
  password: z.string().min(8, "Minimum 8 characters"),
});

export function SignUpcard() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    console.log({ values });
  };

  return (
    <Card className="h-full md:w-[487px] border-none shadow-none p-3 flex justify-center items-center flex-col gap-3 ">
      <CardHeader className=" flex items-center justify-center text-center p-7">
        <CardTitle className="text-2xl m-2">Sign up</CardTitle>
        <CardDescription>
          By signing up, you agree to our <br />
          {/* <Link href="/privacy"> */}
          <span className="text-blue-700">Privacy Policy</span>
          {/* </Link>{" "} */}
          and {/* <Link href="/terms"> */}
          <span className="text-blue-700">Terms of Service</span>
          {/* </Link> */}
        </CardDescription>
      </CardHeader>
      <div className="px-7 mb-2"></div>
      <CardContent className="p-7">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 flex flex-col gap-3"
          >
            <FormField
              name="name"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      {...field}
                      type="name"
                      placeholder="Enter your name"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="email"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      {...field}
                      type="email"
                      placeholder="Enter email address"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="password"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      {...field}
                      type="password"
                      placeholder="Enter your password"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button disabled={false} size="lg" className="w-full">
              Login
            </Button>
          </form>
        </Form>
      </CardContent>
      <div className="px-7">
        <div className="flex justify-center p-4">
          Already have an account ?
          <Link href="/participants/pages/sign-in">
            <span className="text-blue-700">&nbsp;Sign in</span>
          </Link>
        </div>
      </div>
    </Card>
  );
}
