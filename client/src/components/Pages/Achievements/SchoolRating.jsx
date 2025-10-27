import React, { useEffect, useState } from 'react';
import { Modal } from 'react-bootstrap';
import { Button } from "@mui/material";
import { motion } from "framer-motion";
import { red } from '@mui/material/colors';

const emptyRating = {
    year: '',
    cityRank: '',
    cityLink: '',
    countryRank: '',
    countryLink: ''
};

const SchoolRating = ({ user }) => {
    const [ratings, setRatings] = useState([]);
    const [editMode, setEditMode] = useState(false);
    const [currentRating, setCurrentRating] = useState(emptyRating);
    const [editingId, setEditingId] = useState(null);

    const isAdmin = user?.role === 'admin';

    const fetchSchoolRating = async () => {
        try {
            const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/school-ratings`);
            if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
            const data = await res.json();
            setRatings(data);
        } catch (error) {
            console.error('Не вдалося отримати документи:', error);
        }
    };

    useEffect(() => {
        fetchSchoolRating();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCurrentRating(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const method = editingId ? 'PUT' : 'POST';
            const url = editingId
                ? `${process.env.REACT_APP_BACKEND_URL}/api/school-ratings/${editingId}`
                : `${process.env.REACT_APP_BACKEND_URL}/api/school-ratings`;

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(currentRating),
            });

            if (!res.ok) throw new Error('Failed to save rating');

            await fetchSchoolRating();
            setCurrentRating(emptyRating);
            setEditingId(null);
            setEditMode(false);
        } catch (error) {
            console.error(error);
        }
    };

    const handleEdit = (rating) => {
        setCurrentRating({ ...rating });
        setEditingId(rating.id);
        setEditMode(true);
    };

    const handleCancel = () => {
        setCurrentRating(emptyRating);
        setEditingId(null);
        setEditMode(false);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Видалити цей рейтинг?')) return;
        try {
            const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/school-ratings/${id}`, {
                method: 'DELETE'
            });
            if (!res.ok) throw new Error('Failed to delete rating');
            await fetchSchoolRating();
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <>
          
            <section className="container my-5">
                <h2 className="text-center mb-5">Рейтинг школи</h2>
               <div className="position-relative mx-auto" style={{ maxWidth: "700px" }}>
                    {/* Вертикальна лінія */}
                    <div
                        className="position-absolute top-0 bottom-0 start-50 translate-middle-x bg-dark"
                        style={{ width: "4px" }}
                    ></div>

                    {ratings.map((item, index) => (
                        <div
                            key={index}
                            className={`d-flex mb-5 position-relative 
          justify-content-center justify-content-md-${index % 2 === 0 ? "start" : "end"}`}
                        >
                            {/* Кружечок */}
                            <div
                                className="position-absolute bg-dark rounded-circle"
                                style={{
                                    width: "20px",
                                    height: "20px",
                                    top: "20px",
                                    left: "50%",
                                    transform: "translateX(-50%)",
                                    zIndex: 2,
                                }}
                            ></div>
                           
                          
                            <motion.div
                                className="card shadow-sm border-0"
                                style={{ width: "300px", maxWidth: "90%", }}
                                initial={{
                                    opacity: 0,
                                    x: index % 2 === 0 ? -100 : 100, // ліворуч або праворуч
                                }}
                                whileInView={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.8 }}
                                viewport={{ once: true, amount: 0.3 }}
                            >
                                <div className="card-body">
                                    <h6 className="text-dark mb-3">{item.year} р.</h6>

                                    <p className="mb-2">
                                        <span className="display-5 text-success  fw-bold">{item.cityRank}</span>
                                        <a href={item.cityLink} target="_blank" rel="noopener noreferrer" className="ms-1 text-dark">
                                            місце по м. Львів
                                        </a>
                                    </p>

                                    <p className="mb-0">
                                        <span className="display-5 text-dark fw-bold">{item.countryRank}</span>
                                        <a href={item.countryLink} target="_blank" rel="noopener noreferrer" className="ms-1 text-dark">
                                            місце по Україні
                                        </a>
                                    </p>
                                </div>
                                {user?.role === 'admin' && !editMode && (
                                        <div className='position-absolute top-0 end-0' style={{ marginTop: '10px' }}>
                                            <button
                                                onClick={() => handleEdit(item)}
                                                className='btn btn-link btn-sm p-0 me-1'>
                                                ✏️
                                            </button>
                                            <button
                                                onClick={() => handleDelete(item.id)}
                                                style={{ marginLeft: '10px' }}
                                                className='btn btn-link btn-sm p-0'
                                            >
                                                🗑️
                                            </button>
                                        </div>
                                    )}
                            </motion.div>
                        </div>
                    ))}

                </div>
                {isAdmin && !editMode && (
                    <div className='text-center'>
                        <button onClick={() => setEditMode(true)} className="btn btn-outline-success mb-3 mt-4">
                            ➕ Додати новий рейтинг
                        </button>
                    </div>
                )}

                <Modal show={editMode} onHide={handleCancel}>
                    <Modal.Header closeButton>
                        <Modal.Title>{editingId ? 'Редагувати рейтинг' : 'Додати новий рейтинг'}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <form onSubmit={handleSubmit} className="border rounded p-4 shadow" style={{ maxWidth: 400 }}>
                            <div className="mb-3">
                                <label className="form-label">Рік</label>
                                
                                <select
                                    name="year"
                                    value={currentRating.year}
                                    onChange={handleChange}
                                    className="form-control"
                                    required
                                >
                                    <option value="">Оберіть рік</option>
                                    {Array.from(
                                        { length: new Date().getFullYear() - 2000 + 1 },
                                        (_, i) => new Date().getFullYear() - i
                                    ).map((year) => (
                                        <option key={year} value={year}>
                                            {year}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="mb-3">
                                <label className="form-label">Рейтинг по м. Львів</label>
                                <input
                                    type="number"
                                    name="cityRank"
                                    value={currentRating.cityRank}
                                    onChange={handleChange}
                                    className="form-control"
                                    min="1"
                                    required
                                />
                            </div>

                            <div className="mb-3">
                                <label className="form-label">Посилання на рейтинг по м. Львів</label>
                                <input
                                    type="url"
                                    name="cityLink"
                                    value={currentRating.cityLink}
                                    onChange={handleChange}
                                    className="form-control"
                                    required
                                />
                            </div>

                            <div className="mb-3">
                                <label className="form-label">Рейтинг по Україні</label>
                                <input
                                    type="number"
                                    name="countryRank"
                                    value={currentRating.countryRank}
                                    onChange={handleChange}
                                    className="form-control"
                                    min="1"
                                    required
                                />
                            </div>

                            <div className="mb-3">
                                <label className="form-label">Посилання на рейтинг по Україні</label>
                                <input
                                    type="url"
                                    name="countryLink"
                                    value={currentRating.countryLink}
                                    onChange={handleChange}
                                    className="form-control"
                                    required
                                />
                            </div>
                        </form>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="primary" onClick={handleSubmit}>{editingId ? 'Оновити' : 'Додати'}</Button>
                        <Button variant="secondary" onClick={handleCancel}>Відмінити</Button>

                    </Modal.Footer>
                </Modal>
            </section>
            
        </>
    );
};

export default SchoolRating;
