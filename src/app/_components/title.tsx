type Title = {
  title: string;
};

export default function Title({ title }: Title) {
  return (
    <>
      <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 pt-24 ">
        <h1 className="text-5xl font-extrabold tracking-tight sm:text-[5rem]">
          {title}
        </h1>
      </div>
    </>
  );
}
