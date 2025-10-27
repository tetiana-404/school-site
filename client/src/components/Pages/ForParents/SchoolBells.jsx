import React, { useState, useEffect } from "react";
import { Button } from "react-bootstrap";
import TextEditor from "../../TextEditor";

const API_URL = `${process.env.REACT_APP_BACKEND_URL}/api/school-bells`;

const SchoolBells = ({ user }) => {
  const [bells, setBells] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [content, setContent] = useState("");

  const fetchBells = async () => {
    try {
      const res = await fetch(API_URL);
      const data = await res.json();
      setBells(data);
      setContent(data?.content || "");
    } catch (err) {
      console.error("❌ Не вдалося отримати розклад дзвінків:", err);
    }
  };

  useEffect(() => {
    fetchBells();
  }, []);

  const handleSave = async () => {
    try {
      await fetch(API_URL, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content }),
      });
      setEditMode(false);
      fetchBells();
    } catch (err) {
      console.error("❌ Помилка при збереженні розкладу дзвінків:", err);
    }
  };

  return (
    <section className="container py-5 img-100">
      <h2 className="mb-4 text-center">📅 Розклад дзвінків</h2>

      {editMode ? (
        <>
          <TextEditor
            content={content}
            setContent={setContent}
            placeholder="Введіть розклад дзвінків"
          />
          <Button variant="success" className="mt-3 me-2" onClick={handleSave}>
            💾 Зберегти
          </Button>
          <Button variant="secondary" className="mt-3" onClick={() => setEditMode(false)}>
            ❌ Скасувати
          </Button>
        </>
      ) : (
        <>
          <div dangerouslySetInnerHTML={{ __html: bells?.content || "" }} />
          {user?.role === "admin" && (
            <Button variant="outline-secondary" className="mt-3" onClick={() => setEditMode(true)}>
              ✏️ Редагувати
            </Button>
          )}
        </>
      )}
    </section>
  );
};

export default SchoolBells;
