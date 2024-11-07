import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
// import { Separator } from "@radix-ui/react-dropdown-menu";

import Link from "next/link";
import { useRouter } from "next/navigation";

const formSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1, "Required"),
});

export function SignIncard() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const router = useRouter();

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const response = await fetch("/participants/api/sign-in", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      const data = await response.json();

      if (response.ok) {
        console.log("Login successful", data.token);
        localStorage.setItem("token", data.token);
        router.push("/participants/pages/dashboard");
      } else {
        console.error("Login failed:", data.message);
      }
    } catch (error) {
      console.error("Failed to signin", error);
    }
  };

  return (
    <Card className=" flex justify-center items-center flex-col gap-3 h-full md:w-[487px] border-none shadow-none">
      <CardHeader className=" flex items-center justify-center text-center mt-3 p-7">
        <CardTitle className="text-2xl ">Welcome back!</CardTitle>
      </CardHeader>

      <CardContent className="p-7">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 flex flex-col gap-3"
          >
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
          Don&apos;t have an account ?
          <Link href="/participants/pages/sign-up">
            <span className="text-blue-700">&nbsp;Sign up</span>
          </Link>
        </div>
      </div>
    </Card>
  );
}
