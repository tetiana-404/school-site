import React, { useEffect, useState } from "react";
import TextEditor from "../../TextEditor";

const RegDocumentsPage = ({ user }) => {
    const [editMode, setEditMode] = useState(false);
    const [regdocuments, setRegdocuments] = useState(null);

    const documents = [
        {
            title: "Статут гімназії",
            file: "/pdf/statut.pdf",
        },
        {
            title: "Колективний договір (реєстраційний №392 від 21 грудня 2009 року)",
            file: "/pdf/kol_dogovir.pdf",
        },
        {
            title: "Про режим роботи гімназії в умовах воєнного стану та адаптивного карантину",
            file: "/pdf/regime.pdf",
        },
        {
            title: 'Положення про академічну доброчесність Львівської гімназії "Євшан"',
            file: "/pdf/academic_integrity.pdf",
        },
        {
            title: 'Положення про внутрішню систему забезпечення якості освіти ЛГ "Євшан"',
            file: "/pdf/quality_system.pdf",
        },
    ];


    useEffect(() => {
        const fetchRegDocuments = async () => {
            try {
                const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/reg-documents`);
                const data = await res.json();
                setRegdocuments(data);
            } catch (error) {
                console.error("Failed to fetch regdocuments:", error);
            }
        };

        fetchRegDocuments();
    }, []);

    const handleSave = async (endpoint, method, body, callback) => {
        try {
            await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/reg-documents`, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...body,
                    title: 'Нормативні документи',
                }),
            });
            callback();
        } catch (err) {
            console.error(`Помилка при збереженні: ${endpoint}`, err);
        }
    };

    return (
        <section id="regdocumentsPage" className="section-padding bg-light py-5">
            <div className="auto-container">
                <div className="row">
                    <div className='col-lg-12'>
                        <div className="welcome-section-title">
                            <h6 className="theme-color">Львівська гімназія "Євшан"</h6>
                            <h2>Нормативні документи</h2>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className='col-lg-12'>
                        {editMode ? (
                            <>

                                <TextEditor
                                    content={regdocuments?.content || ""}
                                    setContent={(newContent) => setRegdocuments(prev => ({ ...prev, content: newContent }))}
                                    placeholder="Введіть інформацію про нормативні документи гімназії"
                                />

                                <div className="text-center mt-3">
                                    <button
                                        className="btn btn-outline-success btn-lg w-50"
                                        onClick={() =>
                                            handleSave('/api/regdocuments', 'PUT', { content: regdocuments?.content }, () => setEditMode(false))
                                        }
                                    >
                                        💾 Зберегти
                                    </button>
                                    <button className="btn btn-outline-warning btn-lg w-50" onClick={() => setEditMode(false)}>❌ Скасувати</button>
                                </div>
                            </>
                        ) : (
                            <div className='position-relative'>
                                {user?.role === 'admin' && !editMode && (
                                    <button
                                        className="btn btn-outline-dark position-absolute m-0 w-auto"
                                        style={{ top: "-50px", right: 0 }}
                                        onClick={() => setEditMode(true)}
                                    >
                                        ✏️
                                    </button>
                                )}
                                <div dangerouslySetInnerHTML={{ __html: regdocuments?.content || "" }} />
                                <div className="accordion" id="documentsAccordion">
                                    {documents.map((doc, index) => {
                                        const id = `collapse${index}`;
                                        const headingId = `heading${index}`;
                                        return (
                                            <div className="accordion-item" key={index}>
                                                <h2 className="accordion-header" id={headingId}>
                                                    <button
                                                        className={`accordion-button ${index !== 0 ? "collapsed" : ""}`}
                                                        type="button"
                                                        data-bs-toggle="collapse"
                                                        data-bs-target={`#${id}`}
                                                        aria-expanded={index === 0 ? "true" : "false"}
                                                        aria-controls={id}
                                                    >
                                                        {doc.title}
                                                    </button>
                                                </h2>
                                                <div
                                                    id={id}
                                                    className={`accordion-collapse collapse ${index === 0 ? "show" : ""}`}
                                                    aria-labelledby={headingId}
                                                    data-bs-parent="#documentsAccordion"
                                                >
                                                    <div className="accordion-body">
                                                        <iframe
                                                            src={doc.file}
                                                            width="100%"
                                                            height="600px"
                                                            style={{ border: "none" }}
                                                            title={doc.title}
                                                        ></iframe>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                                {user?.role === 'admin' && !editMode && (
                                    <button
                                        className="btn btn-outline-dark position-absolute m-0 w-auto"
                                        style={{ bottom: "0px", right: 0 }}
                                        onClick={() => setEditMode(true)}
                                    >
                                        ✏️
                                    </button>
                                )}
                            </div>
                        )}

                    </div>
                </div>


            </div>
        </section>
    );
};

export default RegDocumentsPage;
