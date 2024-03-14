"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useUser } from "@clerk/nextjs";
import { useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";
import { useAutoAnimate } from '@formkit/auto-animate/react'

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
import { ChangeEvent, useCallback, useRef, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";

const ANIMATION_DELAY = 300;

function getImageData(event: ChangeEvent<HTMLInputElement>) {
  // FileList is immutable, so we need to create a new one
  const dataTransfer = new DataTransfer();

  // Add newly uploaded images
  Array.from(event.target.files!).forEach((image) =>
    dataTransfer.items.add(image)
  );

  const files = dataTransfer.files;
  const displayUrl = URL.createObjectURL(event.target.files![0] ?? new Blob());

  return { files, displayUrl };
}

const FormSchema = z.object({
  name: z
    .string({
      required_error: "Please write a name",
    })
    .min(1, { message: "You must enter a name" })
    .max(256, { message: "Name too long" })
    .describe("Name"),
  image: z
    .object({})
    .describe("Image thumbnail"),
  ingredients: z
    .object({ name: z.string().min(1), amount: z.string().min(1) })
    .array()
    .describe("Ingredients"),
});

export function AddRecipe() {
  const { user } = useUser();
  const { toast } = useToast();
  const imageRef = useRef<HTMLInputElement>(null);

  const [preview, setPreview] = useState("");

  const [animationParent] = useAutoAnimate({ easing: "ease-in", duration: ANIMATION_DELAY, disrespectUserMotionPreference: true });

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    mode: "onChange",
    defaultValues: {
      name: "",
      image: { path: "" },
      ingredients: [],
    },
  });


  const { fields, append, remove } = useFieldArray({
    control: form.control, // control props comes from useForm (optional: if you are using FormContext)
    name: "ingredients", // unique name for your Field Array
  });

  const addNewIngredient = useCallback(() => {
    append({ name: "", amount: "" })
    setTimeout(() => window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" }), ANIMATION_DELAY);
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

  async function onSubmit(data: any) {
    if (!imageRef.current) return;
    const thumbnail = imageRef.current.files![0];
    if (!thumbnail) return;

    const formData = new FormData();
    formData.append('file', thumbnail);

    const uploadResponse = await fetch('http://localhost:3000/api/upload', {
      method: 'PUT',
      body: formData,
    });

    const { url } = await uploadResponse.json() as { url: string };

    if (!user?.id) {
      alert("Not logged in ...somehow");
      return;
    }
    if (!user.primaryEmailAddress) {
      alert("You need to have an email address set to create a word!");
      return;
    }

    createWord.mutate({
      name: data.name,
      userId: user.id,
      imagePath: url ?? undefined,
      ingredients: data.ingredients,
    });
  }

  return (
    <Form {...form}>
      <form ref={animationParent} onSubmit={form.handleSubmit(onSubmit)} className={`space-y-6`}>
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
        <Avatar className="w-24 h-24">
          <AvatarImage src={preview} />
          <AvatarFallback>BU</AvatarFallback>
        </Avatar>
        <FormField
          control={form.control}
          name="image"
          render={({ field: { onChange, value, ...rest } }) => (
            <>
              <FormItem>
                <FormLabel>Image</FormLabel>
                <FormControl>
                  <Input
                    type="file"
                    {...rest}
                    ref={imageRef}
                    onChange={(event) => {
                      const { files, displayUrl } = getImageData(event)
                      setPreview(displayUrl);
                      onChange(files);
                    }}
                  />
                </FormControl>
                <FormDescription>
                  Choose image as a thumbnail of a recipe
                </FormDescription>
                <FormMessage />
              </FormItem>
            </>
          )}
        />
        {fields.map((field, index) => (
          <div
            className="flex-col border p-5 border-white rounded gap-2" key={`${field.id}-field`}>
            <div className="w-full flex justify-end">
              <Button
                onClick={() => remove(index)}
                type="button"
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
