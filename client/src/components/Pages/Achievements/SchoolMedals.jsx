import React, { useEffect, useState } from 'react';
import { Accordion, Card, Button, Form, Row, Col } from 'react-bootstrap';

const API_URL = `${process.env.REACT_APP_BACKEND_URL}/api/school-medals`;

const SchoolMedalists = ({ user }) => {
  const [medalistsData, setMedalistsData] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({});
  const [editingYear, setEditingYear] = useState(null);
  const [newEntry, setNewEntry] = useState({ year: '', gold: '', silver: '' });
  const [errorMsg, setErrorMsg] = useState('');

  const fetchData = async () => {
    try {
      const res = await fetch(API_URL);
      const data = await res.json();
      setMedalistsData(data);
    } catch (err) {
      console.error('❌ Не вдалося отримати дані медалістів:', err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleEdit = (item) => {
    setEditingYear(item.year);
    setFormData({
      gold: normalizeList(item.gold).join(", "),
      silver: normalizeList(item.silver).join(", "),

    });
  };

  const cancelEdit = () => {
    setEditingYear(null);
    setFormData({});
  };

  const saveEdit = async () => {
    if (!formData || !editingYear) return;

    // Знаходимо об'єкт за editingYear
    const item = medalistsData.find(entry => entry.year === editingYear);
    if (!item?.id) {
      console.error('❌ Не знайдено запис для редагування');
      return;
    }

    // Розбити по комі у масив
    const goldArray = formData.gold.split(',').map(name => name.trim()).filter(Boolean);
    const silverArray = formData.silver.split(',').map(name => name.trim()).filter(Boolean);

    try {
      await fetch(`${API_URL}/${item.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          gold: goldArray,
          silver: silverArray,
        }),
      });

      setEditingYear(null);
      setFormData({});
      fetchData();
    } catch (err) {
      console.error('❌ Помилка при збереженні:', err);
    }
  };

  const handleAdd = async () => {
  if (!newEntry.year) return alert('Вкажіть рік');

  const yearNum = Number(newEntry.year);

    if (medalistsData.some(entry => entry.year === yearNum)) {
      setErrorMsg('Такий рік уже існує!');
      return;
    }

  const goldArray = newEntry.gold.split(',').map(name => name.trim()).filter(Boolean);
  const silverArray = newEntry.silver.split(',').map(name => name.trim()).filter(Boolean);

  try {
    await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        year: newEntry.year,
        gold: goldArray,
        silver: silverArray,
      }),
    });

    setNewEntry({ year: '', gold: '', silver: '' }); // очищення форми
    fetchData(); // оновити список
    setErrorMsg('');

  } catch (err) {
    console.error('❌ Помилка при додаванні:', err);
  }
};

const handleDelete = async (id) => {
  if (!window.confirm('Ви впевнені, що хочете видалити цей рік?')) return;

  try {
    await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
    fetchData();
  } catch (err) {
    console.error('❌ Помилка при видаленні:', err);
  }
};


const normalizeList = (field) => {
  if (Array.isArray(field)) return field;
  if (typeof field === 'string') {
    try {
      const parsed = JSON.parse(field);
      if (Array.isArray(parsed)) return parsed;
    } catch (e) {
      return field.split(',').map(s => s.trim()).filter(Boolean);
    }
  }
  return [];
};


  return (
    <section id="medalsSection" className="medalists-section container py-5">
      <h2 className="mb-4">Випускники-медалісти</h2>

      {user?.role === 'admin' && !editMode && (
        <Button variant="outline-secondary" className="mb-3" onClick={() => setEditMode(true)}>
          ✏️ Редагувати
        </Button>
      )}

      {editMode && (
        <Button variant="outline-success" className="mb-3 me-2" onClick={() => setEditMode(false)}>
          ✅ Завершити редагування
        </Button>
      )}

      <Accordion>
        {medalistsData.map((item, idx) => (
          <Accordion.Item eventKey={idx.toString()} key={item.year}>
            <Accordion.Header>{item.year}</Accordion.Header>
            <Accordion.Body>
              {editingYear === item.year ? (
                <>
                  <Form.Group className="mb-2">
                    <Form.Label>Золоті медалі</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      value={formData.gold}
                      onChange={(e) => setFormData({ ...formData, gold: e.target.value })}
                    />
                  </Form.Group>
                  <Form.Group className="mb-2">
                    <Form.Label>Срібні медалі</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      value={formData.silver}
                      onChange={(e) => setFormData({ ...formData, silver: e.target.value })}
                    />
                  </Form.Group>
                  <Button variant="success" onClick={saveEdit} className="me-2">💾 Зберегти</Button>
                  <Button variant="secondary" onClick={cancelEdit}>Скасувати</Button>
                </>
              ) : (
                <Row>
                  <Col md={6}>
                    <h5 className='mb-3'>🥇 <b>Золота медаль</b></h5>

                    

                      <ol>
                        {normalizeList(item.gold).map((name, i) => (
                          <li key={i} className='mb-3'>{name}</li>
                        ))}
                      </ol>
                  </Col>
                  <Col md={6}>
                    <h5 className='mb-3'>🥈 <b>Срібна медаль</b></h5>
                    
                      <ol>
                        {normalizeList(item.silver).map((name, i) => (
                          <li key={i} className='mb-3'>{name}</li>
                        ))}
                      </ol>
                  </Col>
                </Row>
              )}
              {editMode && editingYear !== item.year && (
                <>
                  <Button variant="outline-success" size="sm" className="me-2" onClick={() => handleEdit(item)}>
                    ✏️ Редагувати цей рік
                  </Button>
                  <Button
                    variant="outline-danger"
                    size="sm"
                    onClick={() => handleDelete(item.id)}
                  >
                    🗑️ Видалити цей рік
                  </Button>
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
            <Row className="mb-2">
              <Col md={3}>
                <Form.Control
                  type="number"
                  placeholder="Рік"
                  value={newEntry.year}
                  onChange={(e) => setNewEntry({ ...newEntry, year: e.target.value })}
                />
              </Col>
              <Col md={4}>
                <Form.Control
                  as="textarea"
                  rows={4}
                  placeholder="Золоті медалі (через кому)"
                  value={newEntry.gold}
                  onChange={(e) => setNewEntry({ ...newEntry, gold: e.target.value })}
                />
              </Col>
              <Col md={4}>
                <Form.Control
                  as="textarea"
                  rows={4}
                  placeholder="Срібні медалі (через кому)"
                  value={newEntry.silver}
                  onChange={(e) => setNewEntry({ ...newEntry, silver: e.target.value })}
                />
              </Col>
              <Col md={1}>
                <Button variant="primary" onClick={handleAdd}>Додати</Button>
              </Col>
            </Row>
          </Form>
          {errorMsg && (
            <div className="alert alert-danger" role="alert">
              {errorMsg}
            </div>
          )}
        </div>
      )}
      {user?.role === 'admin' && !editMode && (
        <Button variant="outline-secondary" className="mt-3" onClick={() => setEditMode(true)}>
          ✏️ Редагувати
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

export default SchoolMedalists;
