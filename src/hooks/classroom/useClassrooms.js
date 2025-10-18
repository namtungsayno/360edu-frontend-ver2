// src/hooks/classroom/useClassrooms.js
import { useCallback, useEffect, useState } from "react";
import { classroomService } from "../../services/classroom/classroomService";

export default function useClassrooms(initial = { page: 0, size: 10, q: "" }) {
  const [params, setParams] = useState(initial);
  const [data, setData] = useState({ items: [], page: 0, size: 10, total: 0 });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await classroomService.list(params);
      setData(res);
    } catch (e) {
      setError(
        e?.response?.data?.message || e?.message || "Tải danh sách thất bại"
      );
    } finally {
      setLoading(false);
    }
  }, [params]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const refresh = fetchData;

  return { params, setParams, data, loading, error, refresh };
}
