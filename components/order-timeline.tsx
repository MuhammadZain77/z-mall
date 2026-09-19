"use client";

import React from "react";
import { Order, OrderStatus } from "@/types/product";
import { useAppDispatch } from "@/lib/redux/store";
import { updateOrderStatus } from "@/lib/redux/slices/ordersSlice";
import { addToast } from "@/lib/redux/slices/uiSlice";
import {
  CheckCircle2,
  Clock,
  Truck,
  PackageCheck,
  Building2,
  Copy,
  ChevronRight,
  Sparkles,
} from "lucide-react";

interface OrderTimelineProps {
  order: Order;
  interactive?: boolean;
}

export default function OrderTimeline({
  order,
  interactive = true,
}: OrderTimelineProps) {
  const dispatch = useAppDispatch();

  const statuses: OrderStatus[] = [
    "Order Placed",
    "Processing",
    "Dispatched",
    "In Transit",
    "Delivered",
  ];

  const currentIndex = statuses.indexOf(order.status);

  const getStatusIcon = (status: OrderStatus) => {
    switch (status) {
      case "Order Placed":
        return <CheckCircle2 className="w-4 h-4" />;
      case "Processing":
        return <Building2 className="w-4 h-4" />;
      case "Dispatched":
        return <Truck className="w-4 h-4" />;
      case "In Transit":
        return <Clock className="w-4 h-4" />;
      case "Delivered":
        return <PackageCheck className="w-4 h-4" />;
    }
  };

  const handleAdvanceStatus = () => {
    if (currentIndex < statuses.length - 1) {
      const nextStatus = statuses[currentIndex + 1];
      dispatch(
        updateOrderStatus({
          orderId: order.id,
          newStatus: nextStatus,
        })
      );
      dispatch(
        addToast({
          message: `Order ${order.id} updated to "${nextStatus}"!`,
          type: "success",
        })
      );
    }
  };

  const copyTracking = () => {
    navigator.clipboard.writeText(order.trackingNumber);
    dispatch(
      addToast({
        message: `Tracking code ${order.trackingNumber} copied!`,
        type: "info",
      })
    );
  };

  return (
    <div className="p-6 rounded-2xl bg-[#0a0b10] border border-white/[0.08] space-y-6">
      {/* Header with Tracking Number & Badge */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-white/[0.06]">
        <div>
          <span className="text-xs font-mono text-zinc-500 uppercase tracking-wider">
            Live Order Status
          </span>
          <div className="flex items-center gap-3 mt-1">
            <h3 className="text-xl font-mono font-extrabold text-white">
              {order.status}
            </h3>
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold bg-[#00f59b]/15 text-[#00f59b] border border-[#00f59b]/30">
              ETA: {order.estimatedDelivery}
            </span>
          </div>
        </div>

        {/* Tracking code copy box */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/[0.03] border border-white/[0.08] text-xs font-mono">
          <span className="text-zinc-400">Tracking:</span>
          <span className="font-bold text-white">{order.trackingNumber}</span>
          <button
            onClick={copyTracking}
            className="p-1 hover:text-[#00f59b] text-zinc-400 transition-colors"
            title="Copy tracking number"
          >
            <Copy className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Stepper Steps */}
      <div className="relative">
        <div className="space-y-6">
          {order.timeline.map((step, index) => {
            const isCurrent = step.status === order.status;
            const isDone = step.completed;

            return (
              <div key={index} className="flex items-start gap-4 relative">
                {/* Connecting vertical line */}
                {index < order.timeline.length - 1 && (
                  <div
                    className={`absolute left-4 top-8 -bottom-3 w-0.5 ${
                      isDone ? "bg-[#00f59b]" : "bg-zinc-800"
                    }`}
                  />
                )}

                {/* Step Icon Node */}
                <div
                  className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 z-10 transition-all ${
                    isCurrent
                      ? "bg-[#00f59b] text-black shadow-[0_0_15px_rgba(0,245,155,0.6)] animate-pulse"
                      : isDone
                      ? "bg-[#00f59b]/20 text-[#00f59b] border border-[#00f59b]/40"
                      : "bg-zinc-900 text-zinc-600 border border-zinc-800"
                  }`}
                >
                  {getStatusIcon(step.status)}
                </div>

                {/* Step Content */}
                <div className="flex-1 min-w-0 pt-0.5">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h4
                      className={`text-sm font-bold font-mono tracking-wide ${
                        isDone || isCurrent ? "text-white" : "text-zinc-600"
                      }`}
                    >
                      {step.status}
                    </h4>
                    <span className="text-[11px] font-mono text-zinc-500">
                      {step.timestamp}
                    </span>
                  </div>
                  <p
                    className={`text-xs mt-1 leading-relaxed ${
                      isDone || isCurrent ? "text-zinc-400" : "text-zinc-600"
                    }`}
                  >
                    {step.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Interactive Status Advance Button (Allows testing live order status) */}
      {interactive && currentIndex < statuses.length - 1 && (
        <div className="pt-4 border-t border-white/[0.06] flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-zinc-400 font-mono">
            <Sparkles className="w-3.5 h-3.5 text-[#00f59b]" />
            <span>Simulate Order Dispatch Progression:</span>
          </div>
          <button
            onClick={handleAdvanceStatus}
            className="px-4 py-2 rounded-xl bg-white/[0.05] hover:bg-[#00f59b] text-white hover:text-black border border-white/[0.1] hover:border-[#00f59b] text-xs font-mono font-bold flex items-center gap-1.5 transition-all shadow-sm cursor-pointer"
          >
            <span>Advance to &quot;{statuses[currentIndex + 1]}&quot;</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
}
