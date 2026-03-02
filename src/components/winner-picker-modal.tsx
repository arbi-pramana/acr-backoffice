import { StopOutlined, ThunderboltOutlined } from "@ant-design/icons";
import { Button, Form, Modal, Select, Space, Table, Tag } from "antd";
import { ColumnsType } from "antd/es/table";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useRandomCatalogLogic } from "../hooks/use-random-catalog-logic";
import { Slot } from "../types";

interface WinnerPickerModalProps {
  open: boolean;
  catalogId: number;
  slots: Slot[];
  onCancel?: () => void;
  onSubmit?: (slotId: number, winnerUserSlotId: number) => void;
}

const WinnerPickerModal: React.FC<WinnerPickerModalProps> = ({
  open,
  catalogId,
  slots,
  onCancel,
  onSubmit,
}) => {
  const { numberedSlots, registeredSlots: members } =
    useRandomCatalogLogic(slots);

  // Form states
  const [slotId, setSlotId] = useState<number | undefined>(undefined);
  const [winnerUserSlotId, setWinnerUserSlotId] = useState<number | undefined>(
    undefined,
  );

  // Random picker states
  const [isSpinning, setIsSpinning] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState<number | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const currentIndexRef = useRef<number>(0);

  const stopSpinning = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setIsSpinning(false);
    if (members.length > 0) {
      const chosen = members[currentIndexRef.current];
      setWinnerUserSlotId(chosen.id);
      setHighlightedIndex(currentIndexRef.current);
    }
  }, [members]);

  const startSpinning = useCallback(() => {
    if (members.length === 0) return;
    setWinnerUserSlotId(undefined);
    setIsSpinning(true);

    let idx = 0;
    intervalRef.current = setInterval(() => {
      idx = (idx + 1) % members.length;
      currentIndexRef.current = idx;
      setHighlightedIndex(idx);
    }, 80);
  }, [members]);

  // Cleanup on close
  useEffect(() => {
    if (!open) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      setIsSpinning(false);
      setHighlightedIndex(null);
    }
  }, [open]);

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const handleSubmit = () => {
    if (slotId !== undefined && winnerUserSlotId !== undefined) {
      onSubmit?.(slotId, winnerUserSlotId);
    }
  };

  const handleCancel = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setIsSpinning(false);
    setSlotId(undefined);
    setWinnerUserSlotId(undefined);
    setHighlightedIndex(null);
    onCancel?.();
  };

  const columns: ColumnsType<Slot> = [
    {
      title: "Nama",
      dataIndex: "name",
      key: "name",
      render: (name: string, record: Slot) => {
        const isWinner = record.id === winnerUserSlotId && !isSpinning;
        return (
          <Space>
            <span>{name}</span>
            {isWinner && <Tag color="gold">🏆 Pemenang</Tag>}
          </Space>
        );
      },
    },
    {
      title: "Aksi",
      key: "action",
      width: 90,
      render: (_: unknown, record: Slot) => (
        <Button
          size="small"
          type={record.id === winnerUserSlotId ? "primary" : "default"}
          disabled={isSpinning}
          onClick={() => {
            setWinnerUserSlotId(record.id);
            setHighlightedIndex(members.findIndex((m) => m.id === record.id));
          }}
        >
          Pilih
        </Button>
      ),
    },
  ];

  const tableFooter = () => (
    <div style={{ display: "flex", justifyContent: "flex-start" }}>
      {!isSpinning ? (
        <Button
          icon={<ThunderboltOutlined />}
          onClick={startSpinning}
          disabled={members.length === 0}
          style={{
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            color: "#fff",
            border: "none",
            fontWeight: 600,
          }}
        >
          Pilih Acak
        </Button>
      ) : (
        <Button
          icon={<StopOutlined />}
          danger
          type="primary"
          onClick={stopSpinning}
          style={{ fontWeight: 600 }}
        >
          Berhenti
        </Button>
      )}
    </div>
  );

  return (
    <Modal
      title="Pilih Pemenang"
      open={open}
      onCancel={handleCancel}
      width={560}
      footer={
        <Space>
          <Button onClick={handleCancel}>Batal</Button>
          <Button
            type="primary"
            onClick={handleSubmit}
            disabled={slotId === undefined || winnerUserSlotId === undefined}
          >
            Simpan
          </Button>
        </Space>
      }
    >
      <Form layout="vertical">
        {/* Pilih Slot */}
        <Form.Item label="Pilih Slot">
          <Select
            placeholder="Pilih slot..."
            value={slotId}
            onChange={(value) => setSlotId(value)}
            labelRender={(labelProps) => {
              const slot = numberedSlots.find((s) => s.id === labelProps.value);
              if (!slot) return <span>{labelProps.label}</span>;
              const isToday =
                new Date(slot.payoutAt).toDateString() ===
                new Date().toDateString();

              return (
                <Space>
                  <span>
                    Slot {slot.no} &mdash; {dateFormat(slot.payoutAt)}
                  </span>
                  {isToday && (
                    <Tag color="blue" style={{ marginInlineEnd: 0 }}>
                      Hari ini
                    </Tag>
                  )}
                </Space>
              );
            }}
            optionRender={(option) => {
              const slot = numberedSlots.find((s) => s.id === option.value);
              if (!slot) return option.label;
              const isToday =
                new Date(slot.payoutAt).toDateString() ===
                new Date().toDateString();

              return (
                <Space>
                  <span>
                    Slot {slot.no} &mdash; {dateFormat(slot.payoutAt)}
                  </span>
                  {isToday && (
                    <Tag color="blue" style={{ marginInlineEnd: 0 }}>
                      Hari ini
                    </Tag>
                  )}
                </Space>
              );
            }}
            options={numberedSlots.map((slot) => ({
              value: slot.id,
              label: `Slot ${slot.no} (${dateFormat(slot.payoutAt)})`,
            }))}
          />
        </Form.Item>

        {/* Pilih Pemenang - Table */}
        <Form.Item label="Pilih Pemenang">
          <Table<Slot>
            dataSource={members}
            columns={columns}
            rowKey="id"
            size="small"
            pagination={false}
            footer={tableFooter}
            rowClassName={(record, index) => {
              if (isSpinning && index === highlightedIndex)
                return "row-spinning";
              if (
                !isSpinning &&
                record.id === winnerUserSlotId &&
                highlightedIndex === index
              )
                return "row-winner";
              return "";
            }}
            style={{
              border: "1px solid #f0f0f0",
              borderRadius: 8,
              overflow: "hidden",
            }}
          />
        </Form.Item>
      </Form>

      <style>{`
        .row-spinning td {
          background-color: #e6f4ff !important;
          transition: background-color 0.05s ease;
        }
        .row-spinning td:first-child {
          border-left: 3px solid #1677ff !important;
        }
        .row-winner td {
          background-color: #fffbe6 !important;
          transition: background-color 0.3s ease;
        }
        .row-winner td:first-child {
          border-left: 3px solid #faad14 !important;
        }
      `}</style>
    </Modal>
  );
};

export default WinnerPickerModal;

function dateFormat(dateString: string) {
  const date = new Date(dateString);
  return date.toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}
