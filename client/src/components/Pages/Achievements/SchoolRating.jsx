import React, { useEffect, useState } from 'react';
import { Modal } from 'react-bootstrap';
import { Button } from "@mui/material";

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
        <section id="pabout" className="section-padding bg-light">
            <div className="auto-container">
                <div className="row mb-5">
                    <div className='col-lg-12'>
                        <div className="welcome-section-title">
                            <h6 className="theme-color">Рейтинг школи</h6>
                            <h2>Рейтинг школи</h2>
                        </div>
                    </div>
                </div>

                <div className='row text-center'>
                    {ratings.map(r => (

                        <div key={r.id} className="col-lg-6 col-md-6 col-sm-12 position-relative" style={{ minWidth: 250 }}>

                            <div className='single-featured-item shadow position-relative mb-4'>
                                <div className='text-holder mb-2'>

                                    <h3 className='theme-color mb-3'><b>{r.year}</b></h3>
                                    <img src="/img/trophy.png" className='w-25' alt="Трофей" />
                                </div>


                                <div className="rating-row d-flex justify-content-around flex-wrap gap-4">
                                    <div className="rating-item text-center">
                                         
                                        <div className="icon-holder">
                                            <span>{r.cityRank}</span>
                                        </div>
                                        <div className="text-holder">
                                            <p>
                                                <a href={r.cityLink} target="_blank" rel="noopener noreferrer">
                                                    місце по м. Львів
                                                </a>
                                            </p>
                                        </div>
                                    </div>

                                    <div className="rating-item text-center">
                                        <div className="icon-holder">
                                            <span>{r.countryRank}</span>
                                        </div>
                                        <div className="text-holder">
                                            <p>
                                                <a href={r.countryLink} target="_blank" rel="noopener noreferrer">
                                                    місце по Україні
                                                </a>
                                            </p>
                                        </div>
                                    </div>
                                </div>


                                {/* Кнопки редагування та видалення */}
                                {user?.role === 'admin' && !editMode && (
                                    <div className='position-absolute top-0 end-0' style={{ marginTop: '10px' }}>
                                        <button
                                            onClick={() => handleEdit(r)}
                                            className='btn btn-outline-dark  me-1 w-auto'>
                                            ✏️
                                        </button>
                                        <button
                                            onClick={() => handleDelete(r.id)}
                                            style={{ marginLeft: '10px' }}
                                            className='btn btn-outline-dark  me-3 w-auto'
                                        >
                                            🗑️
                                        </button>
                                    </div>
                                )}

                            </div>
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
                                <input
                                    type="text"
                                    name="year"
                                    value={currentRating.year}
                                    onChange={handleChange}
                                    className="form-control"
                                    placeholder="Наприклад, 2023 - 2024"
                                    required
                                />
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
            </div>
        </section>
    );
};

export default SchoolRating;
