"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useUser } from "@clerk/nextjs";
import { useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/app/_components/ui/form";

import { api } from "~/trpc/react";
import { useToast } from "../_components/ui/use-toast";
import { Input } from "../_components/ui/input";
import { Button } from "../_components/ui/button";

const FormSchema = z.object({
  name: z
    .string({
      required_error: "Please write a name",
    })
    .min(1, { message: "You must enter a name" })
    .max(256, { message: "Name too long" })
    .describe("Name"),
  ingredients: z
    .object({ name: z.string().min(1), amount: z.string().min(1) })
    .array()
    .describe("Ingredients"),
});

export function AddRecipe() {
  const { user } = useUser();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    mode: "onChange",
    defaultValues: {
      name: "",
      ingredients: [],
    },
  });

  const { fields, append } = useFieldArray({
    control: form.control, // control props comes from useForm (optional: if you are using FormContext)
    name: "ingredients", // unique name for your Field Array
  });

  const createWord = api.recipe.create.useMutation({
    onSuccess: () => {
      form.reset();
    },
    onError: (error) => {
      const matches = error.message;
      toast({
        title: "Error",
        description: matches,
        variant: "destructive",
      });
    },
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {
    if (!user?.id) {
      alert("Not logged in ...somehow");
      return;
    }
    if (!user.primaryEmailAddress) {
      alert("You need to have an email address set to create a word!");
      return;
    }
    const newValues = {
      name: data.name,
      userId: user.id,
      ingredients: data.ingredients,
    };
    createWord.mutate(newValues);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className={`space-y-6`}>
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="My word" {...field} />
              </FormControl>
              <FormDescription>Name of the word</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          type="button"
          className="block"
          onClick={() => append({ name: "", amount: "" })}
        >
          +
        </Button>
        {fields.map((field, index) => (
          <div className="flex gap-2" key={`${field.id}-field`}>
            <input
              key={field.id} // important to include key with field's id
              {...form.register(`ingredients.${index}.name`)}
            />
            <input
              key={field.id + "-2"} // important to include key with field's id
              {...form.register(`ingredients.${index}.amount`)}
            />
          </div>
        ))}
        <Button type="submit">Create</Button>
      </form>
    </Form>
  );
}
