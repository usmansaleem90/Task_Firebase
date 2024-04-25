import React, { useState, useEffect, useRef } from 'react';
import Papa from 'papaparse';
import { db } from './firebase';
import "../../App.css"

const Studentdashboard =()=> {
  const [students, setStudents] = useState([]);
  const [file, setFile] = useState(null);
  const [newStudent, setNewStudent] = useState({ name: '', age: '', city: '' });
  const [editingStudentId, setEditingStudentId] = useState("");
  const studentsCollectionRef = useRef(null);

  useEffect(() => {
    studentsCollectionRef.current = db.collection('students');
    getFirestoreData();
  }, []);

  const getFirestoreData = async () => {
    try {
      const snapshot = await studentsCollectionRef.current.get();
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  
    
      const uniqueData = data.map((student, index) => ({
        ...student,
        id: `${student.id}-${index}`
      }));
  
      setStudents(uniqueData);
    } catch (error) {
      console.error('Error fetching data from Firestore:', error);
    }
  };
  

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };


  const handleFileUpload = async () => {
    if (!file) return;

    const parsedData = await new Promise((resolve) => {
      Papa.parse(file, {
        header: true,
        complete: (results) => {
          resolve(results.data);
        }
      });
    });

   
    const studentData = parsedData.map(value => ({
      name: value.name,
      age: value.age,
      city: value.city,
    }));

    try {
      
      await Promise.all(studentData.map(student =>
        studentsCollectionRef.current.add(student)
      ));
      alert('Data uploaded successfully.');
      getFirestoreData();
    } catch (error) {
      console.error('Error uploading data to Firestore:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await studentsCollectionRef.current.doc(id).delete();
      alert('Document deleted successfully.');
      getFirestoreData(); 
    } catch (error) {
      console.error('Error deleting document from Firestore:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewStudent(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleAddStudent = async () => {
    try {
      await studentsCollectionRef.current.add(newStudent);
      alert('Student added successfully.');
      setNewStudent({ name: '', age: '', city: '' }); 
      getFirestoreData()
    } catch (error) {
      console.error('Error adding student to Firestore:', error);
    }
  };

  const handleEdit = async (student) => {
    setEditingStudentId(student.id.split('-')[0]);
    setNewStudent({ name: student.name, age: student.age, city: student.city });
  };
  
  const handleUpdateStudent = async () => {
    try {
      const doc = await studentsCollectionRef.current.doc(editingStudentId).get();
      const docc = doc.id;
      console.log(docc , editingStudentId)
      if (docc !== editingStudentId) {
        console.error('Document does not exist:', editingStudentId);
        return;
      }
  
      else{
        alert("User Edit Successfully")
        await studentsCollectionRef.current.doc(docc).update(newStudent);
      console.log('Student updated successfully.');
      setEditingStudentId("");
      setNewStudent({ name: '', age: '', city: '' });
      getFirestoreData(); 
      }
    } catch (error) {
      console.error('Error updating student in Firestore:', error);
    }
  };
  

  
  

  return (
    <div>
      <div className="container">
      <h1>Student Records Dashboard</h1>
      <div>
        <input type="file" onChange={handleFileChange} accept=".csv" />
        <button className="btn btn-success my-2" onClick={handleFileUpload}>Upload CSV</button>
      </div>
      <div>
        <h2>{editingStudentId ? 'Edit Student' : 'Add New Student'}</h2>
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={newStudent.name}
          onChange={handleInputChange}
        />
        <input
          type="number"
          name="age"
          placeholder="Age"
          value={newStudent.age}
          onChange={handleInputChange}
        />
        <input
          type="text"
          name="city"
          placeholder="City"
          value={newStudent.city}
          onChange={handleInputChange}
        />
        {editingStudentId ? (
          <button className="btn btn-success me-1"  onClick={handleUpdateStudent}>Update Student</button>
        ) : (
          <button className="btn btn-danger" onClick={handleAddStudent}>Add Student</button>
        )}
      </div>
      <table>
        <thead>
          <tr>
            <th>Id</th>
            <th>Name</th>
            <th>Age</th>
            <th>City</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {students.map((student) => (
            <tr key={student.id}>
              <td>{student.id}</td>
              <td>{student.name}</td>
              <td>{student.age}</td>
              <td>{student.city}</td>
              <td>
                <button className="btn btn-success me-1" onClick={() => handleEdit(student)}>Edit</button>
                <button className="btn btn-danger me-1" onClick={() => handleDelete(student.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    </div>
  );
}

export default Studentdashboard;
