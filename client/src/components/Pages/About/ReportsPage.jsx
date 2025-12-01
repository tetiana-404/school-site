import React, { useState, useEffect } from 'react';

const ReportsPage = ({ user }) => {
    const [editMode, setEditMode] = useState(false);
    const [reports, setReports] = useState([]);
    const [editing, setEditing] = useState(null);
    const [newReport, setNewReport] = useState({ year: '', title: '', url: '' });
    const [openYear, setOpenYear] = useState(null);

    // Toggle акордеон по року
    const toggleAccordion = (year) => {
        setOpenYear(prev => (prev === year ? null : year));
    };

    // Завантаження звітів з API
    const fetchReports = async () => {
        try {
            const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/reports/all`);
            if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
            const data = await res.json();
            setReports(data);
        } catch (error) {
            console.error('Не вдалося отримати звіти:', error);
        }
    };

    useEffect(() => {
        fetchReports();
    }, []);

     const handleSubmit = async (e) => {
        e.preventDefault();

        const payload = {
            year: newReport.year,
            title: newReport.title,
            url: newReport.url, 
        };

        const endpoint = editing
            ? `${process.env.REACT_APP_BACKEND_URL}/api/reports/${editing.id}`
            : `${process.env.REACT_APP_BACKEND_URL}/api/reports`;

        const method = editing ? 'PUT' : 'POST';

        try {
            const res = await fetch(endpoint, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

            await fetchReports();
            setNewReport({ year: '', title: '', url: '' });
            setEditing(null);
            setEditMode(false);
        } catch (error) {
            console.error('Не вдалося надіслати звіт:', error);
        }
    };


    const handleEdit = (report) => {
        setNewReport({ year: report.year, title: report.title, file: null, url: report.url || '' });
        setEditing(report);
        setEditMode(true);
    };

    const handleCancelEdit = () => {
        setEditing(null);
        setNewReport({ year: '', title: '', file: null });
        setEditMode(false);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Видалити звіт?')) {
            try {
                await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/reports/${id}`, { method: 'DELETE' });
                await fetchReports();
            } catch (error) {
                console.error('Не вдалося видалити звіт:', error);
            }
        }
    };

    // Групування звітів по роках
    const reportsByYear = reports.reduce((acc, report) => {
        acc[report.year] = acc[report.year] || [];
        acc[report.year].push(report);
        return acc;
    }, {});

    return (
        <section id="directorReports" className="bg-light section-padding">
            <div className="container">
                <div className="text-center mb-5">
                    <h2 className="display-4">Звіти директора</h2>
                    <p>Навчальні звіти директора за роками</p>
                </div>

                <div className="accordion">
                    {Object.keys(reportsByYear).sort((a, b) => b - a).map(year => (
                        <div key={year} className="accordion-item mb-2 border rounded">
                            <div
                                className="accordion-header p-2"
                                style={{ cursor: 'pointer', background: '#f5f5f5' }}
                                onClick={() => toggleAccordion(year)}
                            >
                                <strong>{year}</strong>
                            </div>
                            {openYear === year && (
                                <div className="accordion-body p-2">
                                    <ul className="list-unstyled">
                                        {reportsByYear[year].map(report => (
                                            <li key={report.id} className="mb-1 d-flex justify-content-between align-items-center">
                                                <a
                                                    href={`${report.url}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                >
                                                    {report.title}
                                                </a>
                                                {user?.role === 'admin' && !editMode && (
                                                    <div>
                                                        <button className="btn btn-sm btn-outline-secondary me-1" onClick={() => handleEdit(report)}>✏️</button>
                                                        <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(report.id)}>🗑️</button>
                                                    </div>
                                                )}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                {editMode && (
                    <div className="mt-4">
                        <h4>{editing ? 'Редагування звіту' : 'Додати звіт'}</h4>

                        <form onSubmit={handleSubmit}>
                            {/* Вибір року */}
                            <select
                                value={newReport.year}
                                onChange={(e) => setNewReport({ ...newReport, year: e.target.value })}
                                required
                                className="form-control mb-2"
                            >
                                <option value="">Оберіть рік</option>
                                {Array.from({ length: new Date().getFullYear() - 2000 + 1 }, (_, i) => new Date().getFullYear() - i)
                                    .map((year) => (
                                        <option key={year} value={year}>
                                            {year}
                                        </option>
                                    ))}
                            </select>

                            {/* Назва звіту */}
                            <input
                                type="text"
                                placeholder="Назва звіту"
                                value={newReport.title}
                                onChange={(e) => setNewReport({ ...newReport, title: e.target.value })}
                                required
                                className="form-control mb-2"
                            />

                            {/* Файл */}
                            <input
                                type="url"
                                placeholder="Посилання на PDF"
                                value={newReport.url || ""}
                                onChange={(e) => setNewReport({ ...newReport, url: e.target.value })}
                                required
                                className="form-control mb-2"
                            />

                            {/* Кнопки */}
                            <button type="submit" className="btn btn-outline-success btn-lg me-3">
                                {editing ? 'Оновити' : 'Додати'}
                            </button>
                            <button
                                type="button"
                                className="btn btn-outline-warning btn-lg"
                                onClick={handleCancelEdit}
                            >
                                Відмінити
                            </button>
                        </form>

                    </div>
                )}

                {!editMode && user?.role === 'admin' && (
                    <button className="btn btn-outline-dark mt-3" onClick={() => setEditMode(true)}>➕ Додати звіт</button>
                )}
            </div>
        </section>
    );
};

export default ReportsPage;
