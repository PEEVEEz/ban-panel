"use client";

import { useEffect, useState } from "react";
import { Modal } from "@/components/Modal";
import { Spinner } from "@/components/Spinner";
import { CarbonReset } from "@/components/icons/Reset";
import { MaterialSymbolsAdd } from "@/components/icons/Plus";
import { IServer } from "@/types";

interface AddServerModalProps {
  onSend: (name: string) => void;
  setOpen: (value: boolean) => void;
  open?: boolean;
}

function AddServerModal({
  onSend,
  setOpen,
  open = false,
}: AddServerModalProps) {
  const [name, setName] = useState("");

  return (
    <Modal open={open} setOpen={setOpen}>
      <h1 className="text-neutral-300 text-xl font-semibold">
        Lisää uusi palvelin
      </h1>

      <div className="text-neutral-300">
        <div className="flex flex-col">
          <span className="text-sm font-semibold">Nimi</span>
          <input
            onChange={(e) => setName(e.target.value)}
            className="bg-black/50 rounded border border-white/5 py-1 px-2 outline-none"
          />
        </div>

        <div className="my-2 text-center text-sm text-neutral-500">
          Palvelimen hyväksymisessä menee noin 2 päivää
        </div>

        <div className="flex gap-3">
          <button
            className="bg-red-400 w-1/3 rounded py-1"
            onClick={() => setOpen(false)}
          >
            Sulje
          </button>
          <button
            onClick={() => onSend(name)}
            className="bg-indigo-400 w-full rounded py-1"
          >
            Lisää palvelin
          </button>
        </div>
      </div>
    </Modal>
  );
}

export default function ServersPage() {
  const [open, setOpen] = useState(false);
  const [servers, setServers] = useState<IServer[]>([]);

  const resetApiKey = async (index: number) => {
    try {
      const id = servers[index].id;
      const response = await fetch("/api/servers/reset-api-key", {
        method: "POST",
        body: JSON.stringify({ id }),
      });

      if (!response.ok) {
        throw new Error("Failed to reset API key");
      }

      const data = await response.json();

      const updatedServers = [...servers];
      updatedServers[index] = {
        ...updatedServers[index],
        api_key: data.api_key,
      };
      setServers(updatedServers);
    } catch (error) {
      console.error("Error resetting API key:", error);
    }
  };

  const addServer = async (name: string) => {
    try {
      setOpen(false);
      const response = await fetch("/api/servers/", {
        method: "POST",
        body: JSON.stringify({ name }),
      });

      if (!response.ok) {
        throw new Error("Failed to add server");
      }

      const data = await response.json();
      setServers([...servers, data]);
    } catch (error) {
      console.error("Error adding server:", error);
    }
  };

  const deleteServer = async (id: number) => {
    try {
      await fetch("/api/servers/" + id, {
        method: "delete",
      });

      setServers(servers.filter((v) => v.id !== id));
    } catch (error) {
      console.error("Error deleting server:", error);
    }
  };

  useEffect(() => {
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
  }, []);

  return (
    <div className="p-2 flex items-start w-full gap-5 flex-wrap">
      {servers.map((v, k) => (
        <div
          key={`server_${k}`}
          className="border border-white/5 rounded shadow-sm shadow-white/5 xl:w-1/5 w-full h-52 pt-2 pb-3 px-5 text-neutral-100 flex flex-col"
        >
          <h1 className="text-neutral-200 text-2xl text-center">{v.name}</h1>

          <div className="flex-1">
            {v.verified ? (
              <>
                <span className="text-sm">Api key</span>
                <div className="flex justify-between">
                  <div className="[text-shadow:_0_0_8px_#fff] text-transparent hover:text-neutral-100 hover:[text-shadow:_0_0_0_#fff] transition-all text-xs">
                    {v.api_key}
                  </div>

                  <button onClick={() => resetApiKey(k)}>
                    <CarbonReset className={"w-4"} />
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center justify-center h-full flex-col gap-2">
                <Spinner />
                <span className="text-sm">Palvelimesi on tarkistuksessa</span>
                <span className="text-xs text-neutral-300">
                  Tässä voi kestää muutama päivä!
                </span>
              </div>
            )}
          </div>

          <button
            className="bg-indigo-400/50 w-full p-1.5 rounded"
            onClick={() => deleteServer(v.id)}
          >
            Poista palvelin
          </button>
        </div>
      ))}

      <div
        onClick={() => setOpen(true)}
        className="border border-white/5 rounded shadow-sm shadow-white/5 w-1/5 h-52 py-2 px-5 text-neutral-400 flex items-center justify-center flex-col cursor-pointer"
      >
        <MaterialSymbolsAdd className="w-1/3" />
        <span>Lisää uusi palvelin</span>
      </div>

      <AddServerModal setOpen={setOpen} open={open} onSend={addServer} />
    </div>
  );
}
