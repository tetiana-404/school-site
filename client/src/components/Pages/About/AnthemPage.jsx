import React, { useEffect, useState } from "react";
import TextEditor from "../../TextEditor";

const AnthemPage = ({ user }) => {
    const [editMode, setEditMode] = useState(false);
    const [anthem, setAnthem] = useState(null);

    useEffect(() => {
        const fetchAnthem = async () => {
            try {
                const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/anthem`);
                const data = await res.json();
                setAnthem(data);
            } catch (error) {
                console.error("Failed to fetch Anthem:", error);
            }
        };

        fetchAnthem();
    }, []);

    const handleSave = async (endpoint, method, body, callback) => {
        try {
            await fetch(`${process.env.REACT_APP_BACKEND_URL}/anthem`, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...body,
                    title: 'Гімн гімназії',
                }),
            });
            callback();
        } catch (err) {
            console.error(`Помилка при збереженні: ${endpoint}`, err);
        }
    };

    return (
        <section id="anthemPage" className="section-padding1 bg-light py1-5">
            <div
                className="section-padding section-back-image-2 overlay"
                style={{ backgroundImage: `url(${process.env.PUBLIC_URL + '/img/bg/anthem.jpg'})` }}
            >
                <div className="container h-100">
                    <div className="row h-100">
                        <div className="col-lg-12 my-auto">
                            <div className="text-center">
                                <h2
                                    className="page-banner-title display-1 display-md-3 display-sm-5"
                                    style={{ position: "relative", zIndex: 2, color: "#fff" }}>
                                    Гімн гімназії</h2>
                                <div
                                    className="page-banner-breadcrumb"
                                    style={{ position: "relative", zIndex: 2, color: "#fff" }}>
                                    <p>Слова і музика вчителя гімназії Дембіцької-Прокопець Ніни Григорівни</p>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
            <div className="section-padding">
                <div className="auto-container ">
                    <div className="row">
                        <div className="col-md-6">
                            <div className="poem-column">
                                <div className="stanza">
                                    <p>Є зілля <span className="highlight">євшан</span> в степах України,</p>
                                    <p>Його кожен зна, хто нашої віри.</p>
                                    <p><span className="highlight">Євшане, євшан</span> – знак розуму й сили,</p>
                                    <p>Знак нашим синам служить Україні!</p>
                                </div>
                                <div className="stanza">
                                    <p>В широких степах – кургани, кургани...</p>
                                    <p>Нелегкий нам шлях, євшане, євшане...</p>
                                    <p>Далеким вікам вклоняємось в шані.</p>
                                    <p>Підем у життя у серці з євшаном!</p>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="poem-column">
                                <div className="stanza">
                                    <p><span className="highlight">Євшан</span> – степ, козацька воля,</p>
                                    <p>України слава й доля!</p>
                                    <p><span className="highlight">Євшан</span> – думи патріота,</p>
                                    <p>Бути матері оплотом!</p>
                                </div>
                                <div className="stanza">
                                    <p><span className="highlight">Євшан</span> – квіт любові, мрії,</p>
                                    <p>В майбуття ясної віри,</p>
                                    <p><span className="highlight">Євшан</span> - слово педагога,</p>
                                    <p>Ключ до знань, до перемоги!</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className='col-lg-12'>
                            {editMode ? (
                                <>
                                    <TextEditor
                                        content={anthem?.content || ""}
                                        setContent={(newContent) => setAnthem(prev => ({ ...prev, content: newContent }))}
                                        placeholder="Введіть інформацію установчі документи гімназії"
                                    />

                                    <div className="fixed-bottom-actions text-center mt-5">
                                        <button
                                            className="btn btn-outline-success btn-lg"
                                            onClick={() =>
                                                handleSave('anthem', 'PUT', { content: anthem?.content }, () => setEditMode(false))
                                            }
                                        >
                                            <span>💾 Зберегти</span>
                                        </button>
                                        <button className="btn btn-outline-warning btn-lg" onClick={() => setEditMode(false)}>❌ Скасувати</button>
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
                                    <div dangerouslySetInnerHTML={{ __html: anthem?.content || "" }} />
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
                    <div className="row justify-content-center">
                        <div className="col-lg-4">
                            <div className="poem-column p-4 shadow">
                                <div className="stanza text-center mb-3">
                                    <p>Де того євшану взяти,</p>
                                    <p>Того зілля-привороту,</p>
                                    <p>Що на певний шлях направить,-</p>
                                    <p>Шлях у край свій повороту!</p>
                                </div>
                                <div className="author text-center fst-italic text-success">
                                    (М.Вороний)
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
};

export default AnthemPage;
