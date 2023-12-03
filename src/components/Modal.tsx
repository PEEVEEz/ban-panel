"use client";

interface Props {
  open: boolean;
  setOpen: (value: boolean) => void;

  children: React.ReactNode;
}

export function Modal(props: Props) {
  if (!props.open) return null;

  return (
    <div className="backdrop-blur-[2px] fixed w-full h-full top-0 left-0 px-1 z-50">
      <div className="bg-black/70 border border-white/5 rounded mx-auto max-w-lg mt-10 p-2">
        {props.children}
      </div>
    </div>
  );
}
