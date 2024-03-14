"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useUser } from "@clerk/nextjs";
import { useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";
import { useAutoAnimate } from '@formkit/auto-animate/react'
import { PutBlobResult } from '@vercel/blob'

import ReactCrop, { type Crop } from 'react-image-crop'
import 'react-image-crop/dist/ReactCrop.css'

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
import { Textarea } from "~/components/ui/textarea";

const ANIMATION_DELAY = 300;

export function getCroppedImg(image: HTMLImageElement, crop: Crop): Promise<Blob> | undefined {
  const canvas = document.createElement("canvas");
  const scaleX = image.naturalWidth / image.width;
  const scaleY = image.naturalHeight / image.height;
  canvas.width = crop.width;
  canvas.height = crop.height;
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    alert('no ctx somehow');
    return;
  }

  // New lines to be added
  const pixelRatio = window.devicePixelRatio;
  canvas.width = crop.width * pixelRatio;
  canvas.height = crop.height * pixelRatio;
  ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
  ctx.imageSmoothingQuality = "high";

  ctx.drawImage(
    image,
    crop.x * scaleX,
    crop.y * scaleY,
    crop.width * scaleX,
    crop.height * scaleY,
    0,
    0,
    crop.width,
    crop.height
  );

  // As a blob
  return new Promise((resolve) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) return;
        resolve(blob);
      },
      "image/jpeg",
      1
    );
  });
}

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
  description: z
    .string()
    .describe("Description"),
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
  const croppingImgRef = useRef<HTMLImageElement>(null);

  const [preview, setPreview] = useState("");
  const [crop, setCrop] = useState<Crop>({ unit: 'px', x: 0, y: 0, width: 150, height: 100 });

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

      // reset file input
      if (imageRef.current) imageRef.current.value = "";
      setPreview("")
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

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    if (!data.ingredients.length) {
      toast({
        title: "Error",
        description: "Recipe needs at least one ingredient",
        variant: "destructive",
      });
      return;
    }

    if (!user?.id) {
      alert("Not logged in ...somehow");
      return;
    }
    if (!user.primaryEmailAddress) {
      alert("You need to have an email address set to create a word!");
      return;
    }

    if (!imageRef.current) return;
    const thumbnail = imageRef.current.files![0];
    let uploadedUrl: string | undefined = undefined;
    if (thumbnail && croppingImgRef.current) {

      toast({
        title: "Uploading file",
        description: "Please wait, cropping your image...",
      });
      const formData = new FormData();
      const croppedImage = await getCroppedImg(croppingImgRef.current, crop)
      if (croppedImage) {
        formData.append('file', croppedImage);

        const uploadResponse = await fetch('/api/upload', {
          method: 'PUT',
          body: formData,
        });
        const blobResult = await uploadResponse.json() as PutBlobResult;
        uploadedUrl = blobResult.url;
      }
    }

    createWord.mutate({
      name: data.name,
      userId: user.id,
      imagePath: uploadedUrl,
      ingredients: data.ingredients,
      description: data.description,
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
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea placeholder="My favorite recipe" {...field} />
              </FormControl>
              <FormDescription>Description of a recipe</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        {preview && <ReactCrop crop={crop} aspect={3 / 2} onChange={c => setCrop(c)}>
          <img ref={croppingImgRef} className="h-96" src={preview} />
        </ReactCrop>}
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
