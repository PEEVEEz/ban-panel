"use client";

import { Modal } from "@/components/Modal";
import { useEffect, useState } from "react";
import { Combobox } from "@/components/Combobox";
import { IBan, IBanData, IServer } from "@/types";
import { ZondiconsViewShow } from "@/components/icons/Show";
import { MaterialSymbolsAdd } from "@/components/icons/Plus";
import { MaterialSymbolsCloseRounded } from "@/components/icons/Close";

interface AddBanModalProps {
  setOpen: (value: boolean) => void;
  onSend: (data: IBanData) => void;
  open: boolean;
  servers: IServer[];
}

function AddBanModal({ setOpen, onSend, open, servers }: AddBanModalProps) {
  const [data, setData] = useState<IBanData>({
    name: "",
    reason: "",
    identifiers: {},
  });

  const addBan = async () => {
    if (!data.server) return;
    onSend(data);
  };

  return (
    <Modal open={open} setOpen={(value) => setOpen(value)}>
      <h1 className="text-xl font-semibold">Lisää porttikielto</h1>

      <div className="flex flex-col gap-2 mt-1">
        <div className="flex flex-col">
          <span className="text-sm font-semibold">Nimi</span>
          <input
            onChange={(e) => setData({ ...data, name: e.target.value })}
            className="bg-black/50 rounded border border-white/5 py-1 px-2 outline-none"
          />
        </div>

        <div className="flex flex-col">
          <span className="text-sm font-semibold">Syy</span>
          <input
            onChange={(e) => setData({ ...data, reason: e.target.value })}
            className="bg-black/50 rounded border border-white/5 py-1 px-2 outline-none"
          />
        </div>

        <div className="flex flex-col">
          <span className="text-sm font-semibold">Palvelin</span>

          <Combobox
            selected={data.server}
            setSelected={(v) => setData({ ...data, server: v })}
            items={servers}
            labelKey="name"
          />
        </div>

        <div className="flex flex-col">
          <span className="text-sm font-semibold">Identifiers</span>

          <div className="flex flex-col gap-3">
            {[
              "discord",
              "fivem",
              "steam",
              "license",
              "license2",
              "live",
              "xbox",
            ].map((v) => (
              <div
                key={`identifier_${v}`}
                className="flex items-center gap-2 w-full"
              >
                <span className="text-xs text-white/80 w-1/5">{v}:</span>
                <input
                  onChange={(e) =>
                    setData({
                      ...data,
                      identifiers: { ...data.identifiers, [v]: e.target.value },
                    })
                  }
                  className="bg-black/50 rounded border border-white/5 py-1 px-2 outline-none w-full"
                  placeholder="value"
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-4 flex gap-3">
        <button
          className="bg-red-400 w-1/3 rounded py-1"
          onClick={() => setOpen(false)}
        >
          Sulje
        </button>
        <button onClick={addBan} className="bg-indigo-400 w-full rounded py-1">
          Lisää
        </button>
      </div>
    </Modal>
  );
}

interface BanProps {
  data: IBan;
  index: number;
}

function Ban({ data, index }: BanProps) {
  const [open, setOpen] = useState(false);

  return (
    <tr className="border-b border-white/5">
      <td
        scope="row"
        className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
      >
        {index + 1}
      </td>
      <td className="px-6 py-4">{data.name}</td>
      <td className="px-6 py-4">{data.reason}</td>
      <td className="px-6 py-4">
        <Modal open={open} setOpen={setOpen}>
          <div className="flex justify-between items-center">
            <h1 className="text-xl font-semibold">Identifiers</h1>
            <button
              onClick={() => setOpen(false)}
              className="border border-white/50 rounded-full p-1"
            >
              <MaterialSymbolsCloseRounded className="w-3" />
            </button>
          </div>

          <div>
            {Object.keys(data.identifiers).map((v) => (
              <div key={`identifier_${v}`}>
                {v}: {data.identifiers[v]}
              </div>
            ))}
          </div>
        </Modal>

        <button
          onClick={() => setOpen(true)}
          className="hover:text-indigo-400 flex items-center gap-2"
        >
          <ZondiconsViewShow className="w-5" />
          <span className="text-sm font-semibold">Näytä</span>
        </button>
      </td>
      <td>{new Date(data.expires).toLocaleString()}</td>
    </tr>
  );
}

export default function Home() {
  const [open, setOpen] = useState(false);
  const [bans, setBans] = useState<IBan[]>([]);
  const [servers, setServers] = useState<IServer[]>([]);

  const addBan = async (data: IBanData) => {
    try {
      const response = await fetch("/api/bans", {
        method: "POST",
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Failed to add ban");
      }

      const responseData = await response.json();
      setBans([...bans, responseData]);
      setOpen(false);
    } catch (error) {
      console.error("Error adding ban:", error);
    }
  };

  useEffect(() => {
    const getBans = async () => {
      try {
        const response = await fetch("/api/bans");
        if (!response.ok) {
          throw new Error("Failed to fetch bans");
        }

        const data = await response.json();
        setBans(data);
      } catch (error) {
        console.error("Error fetching bans:", error);
      }
    };

    const getServers = async () => {
      try {
        const response = await fetch("/api/servers");
        if (!response.ok) {
          throw new Error("Failed to fetch servers");
        }

        const data = await response.json();
        setServers(data);
      } catch (error) {
        console.error("Error fetching servers:", error);
      }
    };

    getServers();
    getBans();
  }, []);

  return (
    <div className="text-neutral-300 p-4">
      <div className="flex justify-between items-center pb-3">
        <h1 className="text-xl font-semibold">Porttikiellot</h1>

        <button
          className="flex items-center gap-1.5 bg-indigo-400 px-2 py-1 rounded text-indigo-800 text-sm"
          onClick={() => setOpen(true)}
        >
          <MaterialSymbolsAdd className="w-5" />
          <span className="font-semibold">Lisää porttikielto</span>
        </button>
      </div>

      <div className="relative overflow-x-auto">
        {/* TODO: PAGINATION  */}
        <table className="w-full text-sm text-left rtl:text-right">
          <thead className="text-xs uppercase border border-white/5 rounded">
            <tr>
              <th scope="col" className="px-6 py-3">
                id
              </th>
              <th scope="col" className="px-6 py-3">
                name
              </th>
              <th scope="col" className="px-6 py-3">
                reason
              </th>
              <th scope="col" className="px-6 py-3">
                identifiers
              </th>
              <th scope="col" className="px-6 py-3">
                expires
              </th>
            </tr>
          </thead>
          <tbody>
            {bans && bans.map ? (
              bans.map((v, k) => <Ban data={v} index={k} key={`ban_${k}`} />)
            ) : (
              <></>
            )}
          </tbody>
        </table>
      </div>

      <AddBanModal
        servers={servers}
        onSend={addBan}
        setOpen={(v) => setOpen(v)}
        open={open}
      />
    </div>
  );
}
