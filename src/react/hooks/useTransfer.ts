import { useState, useRef } from "react";
import { SupabaseClient } from "@supabase/supabase-js";
import {
    cancelTransfer,
    finishTransfer,
    startTransfer,
} from "../util/startFinishTransfer";

type TransferType = "Recive" | "Send";

export function useTransfer(
    supabase: SupabaseClient,
    id: string,
    timerOn: boolean,
    timerMode: string,
    totalSeconds: number
) {
    const [modalVisible, setModalVisible] = useState(false);
    const [transferStatus, setTransferStatus] =
        useState<TransferType>("Recive");
    const [transferStatusText, setTransferStatusText] = useState("");
    const [transferRecived, setTransferRecived] = useState(false);
    const [supabaseFinishTime, setSupabaseFinishTime] = useState("");
    const channelRef = useRef<any>(null);

    const handleClose = () => setModalVisible(false);

    const stopListening = () => {
        if (channelRef.current) {
            supabase.removeChannel(channelRef.current);
            channelRef.current = null;
        }
    };

    const openModal = () => {
        console.log(timerOn);
        setTransferStatus(timerOn ? "Send" : "Recive");
        setTransferStatusText(
            timerOn ? "Ready to send timer!" : "Ready to recive timer!",
        );
        setModalVisible(true);
    };

    const transferTimer = async () => {
        if (transferStatus === "Recive") {
            const { data } = await supabase
                .from("session_groups")
                .select("timer_on, finish_time")
                .eq("id", id)
                .single();

            if (data?.timer_on) {
                setSupabaseFinishTime(data.finish_time);
                finishTransfer(supabase, id);
                setModalVisible(false);
            } else {
                setTransferStatusText("Transfer failed!\nTry again!");
            }
            return;
        }

        if (transferStatus === "Send") {
            if (timerMode !== "focus") {
                setTransferStatusText("Cannot transfer break!");
                return;
            }

            startTransfer(supabase, totalSeconds, id); // pass totalSeconds from caller
            setTransferStatusText("Sending...");

            channelRef.current = supabase
                .channel("transfer-channel")
                .on(
                    "postgres_changes",
                    {
                        event: "UPDATE",
                        schema: "public",
                        table: "session_groups",
                        filter: `id=eq.${id}`,
                    },
                    (payload) => {
                        if (payload.new.transfer_status === "recived") {
                            setModalVisible(false);
                            stopListening();
                            setTransferRecived(true);
                            setTimeout(() => setTransferRecived(false), 5000);
                        }
                    },
                )
                .subscribe();

            setTimeout(() => {
                stopListening();
                cancelTransfer(supabase, id);
                setTransferStatusText("Transfer failed!\nTry again!");
            }, 30000);
        }
    };

    return {
        modalVisible,
        setModalVisible,
        transferStatus,
        transferStatusText,
        transferRecived,
        supabaseFinishTime,
        openModal,
        transferTimer,
        stopListening,
        handleClose,
    };
}
