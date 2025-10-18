import React from 'react'
import Table from '../components/dynamicComponents/Table'

const columns = [
  { key: 'name', label: 'Name', width: '220px' },
  { key: 'age', label: 'Age', width: '80px' },
  { key: 'course', label: 'Course', width: '200px' },
  { key: 'city', label: 'City', width: '150px' },
  { key: 'contactNo', label: 'Contact No', width: '140px' },
  { key: 'gender', label: 'Gender', width: '100px' },
  { key: 'group', label: 'Group', width: '130px' },
  { key: 'email', label: 'Email', width: '260px' },
  { key: 'admissionYear', label: 'Admission Year', width: '140px' },
  { key: 'gpa', label: 'GPA', width: '80px' }
]

const rows = [
  { name: 'Rohit Sharma', age: 22, course: 'Computer Science', city: 'Jaipur', contactNo: '9876501001', gender: 'male', group: 'Engineering', email: 'rohit.sharma@example.com', admissionYear: 2021, gpa: 8.9 },
  { name: 'Priya Patel', age: 21, course: 'Mathematics', city: 'Ahmedabad', contactNo: '8765402002', gender: 'female', group: 'Science', email: 'priya.patel@example.com', admissionYear: 2020, gpa: 8.5 },
  { name: 'Amit Kumar', age: 23, course: 'Mechanical', city: 'Patna', contactNo: '7654303003', gender: 'male', group: 'Engineering', email: 'amit.kumar@example.com', admissionYear: 2019, gpa: 8.1 },
  { name: 'Sara Singh', age: 20, course: 'Design', city: 'Delhi', contactNo: '9876504004', gender: 'female', group: 'Design', email: 'sara.singh@example.com', admissionYear: 2022, gpa: 9.0 },
  { name: 'Vikas Mehta', age: 24, course: 'Civil', city: 'Surat', contactNo: '8765411011', gender: 'male', group: 'Engineering', email: 'vikas.mehta@example.com', admissionYear: 2018, gpa: 7.8 },
  { name: 'Neha Kapoor', age: 22, course: 'Business', city: 'Lucknow', contactNo: '7654312012', gender: 'female', group: 'Management', email: 'neha.kapoor@example.com', admissionYear: 2021, gpa: 8.3 },
  { name: 'Manish Jain', age: 23, course: 'Electronics', city: 'Indore', contactNo: '9876513013', gender: 'male', group: 'Engineering', email: 'manish.jain@example.com', admissionYear: 2019, gpa: 8.0 },
  { name: 'Aisha Khan', age: 21, course: 'Biotechnology', city: 'Bhopal', contactNo: '8765414014', gender: 'female', group: 'Science', email: 'aisha.khan@example.com', admissionYear: 2020, gpa: 8.6 },
  { name: 'Karan Verma', age: 25, course: 'Architecture', city: 'Nagpur', contactNo: '9876519019', gender: 'male', group: 'Design', email: 'karan.verma@example.com', admissionYear: 2017, gpa: 7.9 },
  { name: 'Anjali Sharma', age: 22, course: 'Physics', city: 'Agra', contactNo: '8765420020', gender: 'female', group: 'Science', email: 'anjali.sharma@example.com', admissionYear: 2021, gpa: 8.7 }
]

const TableTest : React.FC = () => {
  return (
    <div>
        <Table columns={columns} rows={rows} />
    </div>
  )
}

export default TableTest
