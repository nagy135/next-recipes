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
import plusIcon from "~/assets/icons/plus";
import { Separator } from "~/components/ui/separator";
import { useCallback, useEffect } from "react";

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


  const { fields, append, remove } = useFieldArray({
    control: form.control, // control props comes from useForm (optional: if you are using FormContext)
    name: "ingredients", // unique name for your Field Array
  });

  const addNewIngredient = useCallback(() => {
    append({ name: "", amount: "" })
  }, []);

  const createWord = api.recipe.create.useMutation({
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Recipe created",
      });
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

  useEffect(() => {
    window.scrollTo(0, document.body.scrollHeight);
  }, [fields])

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
                <Input placeholder="New recipe" {...field} />
              </FormControl>
              <FormDescription>Name of the food you are adding</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        {fields.map((field, index) => (
          <div className="flex-col border p-5 border-white rounded gap-2" key={`${field.id}-field`}>
            <div className="w-full flex justify-end">
              <Button
                onClick={() => remove(index)}
                className="" variant="destructive">X</Button>
            </div>
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input
                  placeholder="Onions"
                  {...field}
                  {...form.register(`ingredients.${index}.name`)}
                />
              </FormControl>
              <FormDescription>Name of the ingredient</FormDescription>
              <FormMessage />
            </FormItem>
            <FormItem>
              <FormLabel>Amount</FormLabel>
              <FormControl>
                <Input
                  placeholder="200g"
                  {...field}
                  {...form.register(`ingredients.${index}.amount`)}
                />
              </FormControl>
              <FormDescription>Amount of ingredient</FormDescription>
              <FormMessage />
            </FormItem>
            <Separator className="mt-2" />
          </div>
        ))}
        <div className="flex gap-2">
          <Button
            type="button"
            className="flex"
            onClick={() => addNewIngredient()}
          >
            <span className="flex pr-2">{plusIcon}</span> ingredient
          </Button>
          <Button type="submit">Create</Button>
        </div>
      </form>
    </Form>
  );
}
