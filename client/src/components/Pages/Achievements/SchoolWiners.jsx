import React, { useState, useEffect } from 'react';
import { Accordion, Button, Form } from 'react-bootstrap';
import TextEditor from "../../TextEditor";
const API_URL = `${process.env.REACT_APP_BACKEND_URL}/api/olympiads`;

const SchoolWinners = ({ user }) => {
    const [data, setData] = useState([]);
    const [editYear, setEditYear] = useState(null);
    const [editMode, setEditMode] = useState(false);
    const [formData, setFormData] = useState({ year: '', content: '' });
    const [errorMsg, setErrorMsg] = useState('');
    // eslint-disable-next-line no-unused-vars
    const [showToast, setShowToast] = useState(false);

    const fetchData = async () => {
        try {
            const res = await fetch(API_URL);
            const data = await res.json();
            setData(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error('❌ Не вдалося отримати дані медалістів:', err);
        }

    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleEdit = (item) => {
        setEditYear(item.year);
        setFormData({ year: item.year, content: item.content });
    };

    const handleSave = async () => {
        if (!formData.year) return;

        if (!formData || !editYear) return;

        const item = data.find(entry => entry.year === editYear);
        if (!item?.id) {
            console.error('❌ Не знайдено запис для редагування');
            return;
        }

        try {
            await fetch(`${API_URL}/${item.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });
            setEditYear(null);
            setFormData({ year: '', content: '' });
            fetchData();
        } catch (err) {
            console.error('❌ Error updating:', err);
        }
    };

    const handleAdd = async () => {
        const yearNum = Number(formData.year);

        if (!yearNum || !formData.content.trim()) {
            setErrorMsg('Заповніть рік і контент');
            setShowToast(true);
            return;
        }

        if (data.some(entry => entry.year === yearNum)) {
            setErrorMsg('Такий рік уже існує!');
            setShowToast(true);
            return;
        }
        try {
            
            const res = await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...formData, year: yearNum }),
            });

            if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

            setFormData({ year: '', content: '' });
            
            setErrorMsg('');
            setShowToast(false);
            fetchData();
        } catch (err) {
            console.error('❌ Error adding:', err);
             setErrorMsg('Помилка при збереженні');
        setShowToast(true);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm(`Ви дійсно хочете видалити цей рік?`)) return;
        try {
            await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
            fetchData();
        } catch (err) {
            console.error('❌ Error deleting:', err);
        }
    };

    return (
        <section className="winers-section container py-5">
            <h2 className="mb-4 text-center">🏆 Переможці олімпіад</h2>

            {user?.role === 'admin' && !editMode && (
                <Button variant="outline-secondary" className="mb-3" onClick={() => setEditMode(true)}>
                    ➕ Додати новий рік
                </Button>
            )}

            {editMode && (
                <Button variant="outline-success" className="mb-3 me-2" onClick={() => setEditMode(false)}>
                    ✅ Завершити редагування
                </Button>
            )}

            <Accordion>
                {data.map((item, idx) => (
                    <Accordion.Item eventKey={idx.toString()} key={item.year}>
                        <Accordion.Header>{item.year}</Accordion.Header>
                        <Accordion.Body>
                            {editYear === item.year ? (
                                <>



                                    <TextEditor
                                        content={formData?.content || ""}
                                        setContent={(newContent) =>
                                            setFormData((prev) => ({ ...prev, content: newContent }))
                                        }
                                        placeholder="Введіть інформацію про переможців гімназії"
                                    />

                                    <Button variant="success" className="mt-2" onClick={handleSave}>💾 Зберегти</Button>
                                    <Button variant="secondary" className="mt-2 ms-2" onClick={() => setEditYear(null)}>Скасувати</Button>
                                </>
                            ) : (
                                <>
                                    <div dangerouslySetInnerHTML={{ __html: item.content }} />
                                    {user?.role === 'admin' && (
                                        <div className="mt-2">
                                            <Button size="sm" variant="outline-secondary" onClick={() => handleEdit(item)}>✏️ Редагувати</Button>
                                            <Button size="sm" variant="outline-danger" className="ms-2" onClick={() => handleDelete(item.id)}>🗑️ Видалити</Button>
                                        </div>
                                    )}
                                </>
                            )}
                        </Accordion.Body>
                    </Accordion.Item>
                ))}
            </Accordion>
            {editMode && (
                <div className="mt-5 border-top pt-4">
                    <h4>➕ Додати новий рік</h4>
                    <Form className="mb-3">

                        <Form.Control
                            type="number"
                            placeholder="Рік"
                            value={formData.year}
                            className="mb-3"
                            onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) })}
                        />
                        <TextEditor
                            key={formData.year + '-editor'} // ключ, який змінюється при очищенні
                            content={formData?.content || ""}
                            setContent={(newContent) =>
                                setFormData((prev) => ({ ...prev, content: newContent }))
                            }
                            placeholder="Введіть інформацію про переможців гімназії"
                        />

                        <Button variant="primary" className="mt-3 w-100" onClick={handleAdd}>Додати</Button>


                    </Form>

                    {errorMsg && <div className="text-danger mt-2">{errorMsg}</div>}
                </div>
            )}
            {user?.role === 'admin' && !editMode && (
                <Button variant="outline-secondary" className="mt-3" onClick={() => setEditMode(true)}>
                    ➕ Додати новий рік
                </Button>
            )}

            {editMode && (
                <Button variant="outline-success" className="mt-3 me-2" onClick={() => {
                    setEditMode(false);
                    setErrorMsg('');
                }}>
                    ✅ Завершити редагування
                </Button>
            )}
        </section>
    );
};

export default SchoolWinners;
