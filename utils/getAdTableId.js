export const getAdTableId = (ad) =>
  Number(
    ad?.table_id ||
      ad?.tableId ||
      ad?.department?.id ||
      ad?.table?.id ||
      ad?.Table?.id ||
      ad?.category?.table_id ||
      ad?.Categories?.table_id ||
      ad?.Category?.table_id,
  );
