import { useState } from "react";

interface Props {
  items: any[];
  labelKey?: string;

  selected: any;
  setSelected: (item: any) => void;
}

export function Combobox(props: Props) {
  const [open, setOpen] = useState(false);

  return (
    <div className="w-full relative">
      <button
        onClick={() => setOpen(!open)}
        className="bg-black/50 rounded border border-white/5 py-1 px-2 outline-none w-full text-start"
      >
        {props.selected
          ? props.labelKey
            ? props.selected[props.labelKey]
            : props.selected
          : "Valitse palvelin"}
      </button>

      {open && (
        <div className="bg-black border absolute mt-2 rounded flex flex-col w-full p-2 border-white/5">
          {props.items.map((v, k) => {
            return (
              <div
                key={`combobox_item_${k}`}
                onClick={() => {
                  setOpen(false);
                  props.setSelected(v);
                }}
                className="hover:scale-y-110 cursor-pointer"
              >
                {props.labelKey ? v[props.labelKey] : v}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
