import React, { useState, useEffect } from 'react';

const SchoolClubsTimetable = ({ user }) => {
    const [editMode, setEditMode] = useState(false);
    const [documents, setDocuments] = useState([]);
    const [editing, setEditing] = useState(null);
    const [newDoc, setNewDoc] = useState({ title: '', file: null });
    const [errorMsg, setErrorMsg] = useState('');

    const fetchSchedule = async () => {
        try {
            const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/school-clubs-timetable`);
            if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
            const data = await res.json();
            setDocuments(data);
        } catch (error) {
            console.error('Не вдалося отримати розклад гуртків:', error);
        }
    };

    useEffect(() => {
        fetchSchedule();
    }, []);

    const handleFileChange = (e) => {
        setNewDoc({ ...newDoc, file: e.target.files[0] });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!newDoc.title) {
            setErrorMsg('Введіть назву документа');
            return;
        }

        const formData = new FormData();
        formData.append('title', newDoc.title);
        if (newDoc.file) formData.append('file', newDoc.file);

        const endpoint = editing
            ? `${process.env.REACT_APP_BACKEND_URL}/api/school-clubs-timetable/${editing.id}`
            : `${process.env.REACT_APP_BACKEND_URL}/api/school-clubs-timetable`;

        const method = editing ? 'PUT' : 'POST';

        try {
            await fetch(endpoint, {
                method,
                body: formData,
            });

            await fetchSchedule();
            setNewDoc({ title: '', file: null });
            setEditing(null);
            setEditMode(false);
            setErrorMsg('');
        } catch (error) {
            console.error('Не вдалося зберегти документ:', error);
        }
    };

    const handleEdit = (doc) => {
        setNewDoc({ title: doc.title, file: null });
        setEditing(doc);
        setEditMode(true);
    };

    const handleCancelEdit = () => {
        setEditing(null);
        setNewDoc({ title: '', file: null });
        setEditMode(false);
        setErrorMsg('');
    };

    const handleDelete = async (id) => {
        if (window.confirm('Видалити розклад гуртків?')) {
            try {
                await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/school-clubs-timetable/${id}`, {
                    method: 'DELETE',
                });
                await fetchSchedule();
            } catch (error) {
                console.error('Не вдалося видалити документ:', error);
            }
        }
    };

    return (
        <section id="clubsSchedulePage" className="section-padding bg-light py-5">
            <div className="auto-container">
                <div className="row">
                    <div className="col-lg-12">
                        <div className="welcome-section-title">
                            <h6 className="theme-color">Львівська гімназія "Євшан"</h6>
                            <h2>🎭 Розклад гуртків</h2>
                        </div>
                    </div>
                </div>

                <div className="row">
                    <div className="col-lg-12">
                        <div className="py-3">
                            {documents?.map(doc => (
                                <div
                                    className="accordion-content"
                                    style={{ padding: '10px', marginBottom: '20px', border: '1px solid #ddd', borderRadius: '8px' }}
                                    key={doc.id}
                                >
                                    <h5>{doc.title}</h5>
                                    <iframe
                                        src={`${process.env.REACT_APP_BACKEND_URL}/uploads/documents/${doc.file}`}
                                        width="100%"
                                        height="600px"
                                        style={{ border: '1px solid #ccc', marginTop: '10px' }}
                                        title={`Розклад гуртків: ${doc.title}`}
                                    />

                                    {user?.role === 'admin' && !editMode && (
                                        <div style={{ marginTop: '10px' }}>
                                            <button onClick={() => handleEdit(doc)}>✏️ Редагувати</button>
                                            <button
                                                onClick={() => handleDelete(doc.id)}
                                                style={{ marginLeft: '10px' }}
                                            >
                                                🗑️ Видалити
                                            </button>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>

                        {editMode ? (
                            <>
                                <h3>{editing ? 'Редагування розкладу гуртків' : 'Додати розклад гуртків'}</h3>
                                {errorMsg && <div className="text-danger mb-2">{errorMsg}</div>}
                                <form onSubmit={handleSubmit}>
                                    <input
                                        type="file"
                                        accept="application/pdf"
                                        onChange={handleFileChange}
                                        className="mb-2"
                                    />
                                    <input
                                        type="text"
                                        placeholder="Назва розкладу"
                                        value={newDoc.title}
                                        onChange={(e) =>
                                            setNewDoc({ ...newDoc, title: e.target.value })
                                        }
                                        required
                                        className="mb-2"
                                    />
                                    <br />
                                    <button type="submit">
                                        {editing ? '✏️ Оновити' : '➕ Додати'}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={handleCancelEdit}
                                        style={{ marginLeft: '8px' }}
                                    >
                                        ❌ Вийти
                                    </button>
                                </form>
                            </>
                        ) : (
                            user?.role === 'admin' && (
                                <button
                                    className="btn btn-outline-dark mt-3"
                                    onClick={() => setEditMode(true)}
                                >
                                    ➕ Додати розклад гуртків
                                </button>
                            )
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default SchoolClubsTimetable;
