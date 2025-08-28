import React, { useState, useEffect } from 'react';

const CounterSection = ({ user }) => {
  const [items, setItems] = useState([]);
  const [editedItems, setEditedItems] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [subtitle, setSubtitle] = useState('');

  useEffect(() => {
    fetch(`${process.env.REACT_APP_BACKEND_URL}/api/counters`)
      .then(res => res.json())
      .then(data => {
        setItems(data);
        setEditedItems(data);
      })
      .catch(err => console.error('❌ Failed to fetch counters:', err));

    fetch(`${process.env.REACT_APP_BACKEND_URL}/api/home-meta`)
      .then(res => res.json())
      .then(data => {
        if (data.subtitle) setSubtitle(data.subtitle);
      })
      .catch(err => console.error('❌ Failed to fetch home-meta:', err));
  }, []);

  const handleChange = (index, field, value) => {
    const updated = [...editedItems];
    updated[index] = { ...updated[index] };

    if (field === 'value') {
      updated[index][field] = Number(value) || 0;
    } else {
      updated[index][field] = value;
    }

    setEditedItems(updated);
  };

  const saveChanges = async () => {
    try {
      await Promise.all(
        editedItems.map(item =>
          fetch(`${process.env.REACT_APP_BACKEND_URL}/api/counters/${item.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(item),
          }).then(res => {
            if (!res.ok) throw new Error(`Failed to update counter with id ${item.id}`);
            return res.json();
          })
        )
      );

      const resMeta = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/home-meta`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subtitle }),
      });

      if (!resMeta.ok) throw new Error('Failed to update home-meta subtitle');

      setItems(editedItems);
      setEditMode(false);
    } catch (err) {
      console.error("❌ Failed to save", err);
    }
  };

  const cancelChanges = () => {
    setEditedItems(items);
    setEditMode(false);
  };

  return (
    <section id="counter" className="counter-padding overlay text-white py-5 section-back-image position-relative">
      {user?.role === 'admin' && !editMode && (
        <div className="position-absolute top-0 end-0 p-3 z-3">
          <button className="btn btn-outline-light btn-md" onClick={() => setEditMode(true)}>
            ✏️
          </button>
        </div>
      )}

      <div className="auto-container">
        <div className="row justify-content-center">
          <div className="col-lg-8 text-left">
            <div className="counter-info mb-4">
              <div className="counter-icon">
                <i className="fas fa-history" style={{ fontSize: window.innerWidth < 576 ? "0.8em" : "2em" }}></i> 

              </div>
              <div className="counter-des">
                <h2>
                  <span>Ми ростемо разом,</span> <br /> день за днем, крок за кроком!
                </h2>
                {editMode ? (
                  <textarea
                    value={subtitle}
                    onChange={(e) => setSubtitle(e.target.value)}
                    rows="2"
                    className="form-control text-center my-3"
                    placeholder="Підпис під заголовком"
                  />
                ) : (
                  <p>{subtitle}</p>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className='row mt-5 wow fadeInUp'>
          <div className="col-lg-8 col-md-8 col-12 mx-lg-auto mx-md-auto mx-0 text-lg-left text-md-left">
            <div className="row">
              {editMode ? (
                <>
                  {editedItems.map((item, i) => (
                    <div key={item.id || i} className="col-lg-3 col-md-3 col-sm-6 col-12 mb-4">
                      <div className="single-counter-item text-center">
                        <input
                          type="number"
                          value={item.value}
                          onChange={(e) => handleChange(i, 'value', e.target.value)}
                          className="form-control mb-2"
                          placeholder="Значення"
                        />
                        <textarea
                          value={item.description || ''}
                          onChange={(e) => handleChange(i, 'description', e.target.value)}
                          rows="2"
                          className="form-control"
                          placeholder="Опис"
                        />
                      </div>
                    </div>
                  ))}
                  <div className="col-12 text-center mt-3 single-counter-item">
                    <button className="btn btn-success w-50" onClick={saveChanges}>💾 Зберегти</button>
                    <button className="btn btn-outline-light w-50" onClick={cancelChanges}>❌ Скасувати</button>
                  </div>
                </>
              ) : (
                items.map((item, i) => (
                  <div key={item.id || i} className="col-lg-3 col-md-3 col-sm-6 col-12 mb-4">
                    <div className="single-counter-item text-left">
                      <h4 className="fw-bold display-6">{item.value}</h4>
                      <p className="mb-0 text-uppercase">{item.description}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CounterSection;
