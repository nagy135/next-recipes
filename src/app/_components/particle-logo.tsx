"use client";
import React from "react";
import { SparklesCore } from "~/app/_components/ui/sparkles";

type ParticleLogoProps = {
  title: string;
}

export function ParticleLogo({ title }: ParticleLogoProps) {


  return (
    <div className="h-[20rem] w-full bg-gray-200 flex flex-col items-center justify-center overflow-hidden rounded-md mb-5">
      <h1 className="md:text-7xl text-3xl lg:text-9xl font-bold text-center text-[#0b0b0b] relative z-20">
        {title}
      </h1>
      <div className="w-[40rem] h-40 relative">
        {/* Gradients */}
        <div className="absolute inset-x-20 top-0 bg-gradient-to-r from-transparent via-indigo-500 to-transparent h-[2px] w-3/4 blur-sm" />
        <div className="absolute inset-x-20 top-0 bg-gradient-to-r from-transparent via-indigo-500 to-transparent h-px w-3/4" />
        <div className="absolute inset-x-60 top-0 bg-gradient-to-r from-transparent via-sky-500 to-transparent h-[5px] w-1/4 blur-sm" />
        <div className="absolute inset-x-60 top-0 bg-gradient-to-r from-transparent via-sky-500 to-transparent h-px w-1/4" />

        {/* Core component */}
        <SparklesCore
          background="transparent"
          minSize={0.4}
          maxSize={1}
          particleDensity={1900}
          className="w-full h-full"
          particleColor="#0b0b0b"
        />

        {/* Radial Gradient to prevent sharp edges */}
        <div className="absolute inset-0 w-full h-full bg-gray-200 [mask-image:radial-gradient(350px_200px_at_top,transparent_20%,white)]"></div>
      </div>
    </div >
  );
}
