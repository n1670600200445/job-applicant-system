import {
  useEffect,
  useState
} from 'react';

import {
  getApplicants,
  createApplicant,
  updateApplicant,
  updateStatus,
  deleteApplicant
}
from '../services/applicantService';

export default function Home() {

  const [applicants, setApplicants] =
    useState([]);

  const [loading, setLoading] =
    useState(false);

  const [editingId, setEditingId] =
    useState(null);

  const [search, setSearch] =
    useState('');

  const [filterStatus, setFilterStatus] =
    useState('');

  const [sortOrder, setSortOrder] =
    useState('desc');

  const [errors, setErrors] =
    useState({});

  const [currentPage, setCurrentPage] =
    useState(1);

  const itemsPerPage = 5;

  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    position: '',
    note: ''
  });

  async function loadApplicants() {

    setLoading(true);

    try {

      const result =
        await getApplicants();

      setApplicants(result.data);

    } catch (error) {

      alert('Load failed');
    }

    setLoading(false);
  }

  useEffect(() => {

    loadApplicants();

  }, []);

  const filteredApplicants =
    applicants

      .filter((item) => {

        const matchName =
          item.name
            .toLowerCase()
            .includes(
              search.toLowerCase()
            );

        const matchStatus =
          filterStatus === ''
            ? true
            : item.status === filterStatus;

        return (
          matchName &&
          matchStatus
        );
      })

      .sort((a, b) => {

        const dateA =
          new Date(a.created_at);

        const dateB =
          new Date(b.created_at);

        return sortOrder === 'desc'
          ? dateB - dateA
          : dateA - dateB;
      });

  const totalPages =
    Math.ceil(
      filteredApplicants.length /
      itemsPerPage
    );

  const startIndex =
    (currentPage - 1) *
    itemsPerPage;

  const paginatedApplicants =
    filteredApplicants.slice(
      startIndex,
      startIndex + itemsPerPage
    );

  function validateForm() {

    let newErrors = {};

    if (!form.name.trim()) {

      newErrors.name =
        'Name is required';
    }

    if (!form.email.trim()) {

      newErrors.email =
        'Email is required';

    } else {

      const emailRegex =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (
        !emailRegex.test(form.email)
      ) {

        newErrors.email =
          'Invalid email format';
      }
    }

    if (!String(form.phone).trim()) {

      newErrors.phone =
        'Phone is required';

    } else {

      const phoneRegex =
        /^[0-9]+$/;

      if (
        !phoneRegex.test(
  String(form.phone)
)
      ) {

        newErrors.phone =
          'Phone must be numeric';
      }
    }

    if (!form.position.trim()) {

      newErrors.position =
        'Position is required';
    }

    setErrors(newErrors);

    return Object.keys(newErrors)
      .length === 0;
  }

  function handleChange(e) {

    setForm({
      ...form,
      [e.target.name]:
        e.target.value
    });
  }

  async function handleSubmit(e) {

  e.preventDefault();

  if (!validateForm()) {
    return;
  }

  try {

    let result;

    if (editingId) {

      result =
        await updateApplicant({
          id: editingId,
          ...form
        });

    } else {

      result =
        await createApplicant(form);
    }

    console.log(result);

    if (result && result.success) {

      alert(
        editingId
          ? 'Update success'
          : 'Create success'
      );

      setForm({
        name: '',
        email: '',
        phone: '',
        position: '',
        note: ''
      });

      setEditingId(null);

      loadApplicants();

    } else {

      alert(
        result?.message ||
        'Update failed'
      );
    }

  } catch (error) {

    console.error(error);

    alert(
      'Server error'
    );
  }
}
  async function handleDelete(id) {

    const confirmDelete =
      window.confirm(
        'Confirm delete?'
      );

    if (!confirmDelete) {
      return;
    }

    const result =
      await deleteApplicant(id);

    if (result.success) {

      alert('Delete success');

      loadApplicants();

    } else {

      alert(result.message);
    }
  }

function handleEdit(item) {

  setEditingId(item.id);

  setForm({
    name: item.name,
    email: item.email,
    phone: item.phone,
    position: item.position,
    note: item.note || ''
  });

  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
}

  async function handleStatusChange(
    id,
    status
  ) {

    const result =
      await updateStatus(
        id,
        status
      );

    if (result.success) {

      alert('Status updated');

      loadApplicants();

    } else {

      alert(result.message);
    }
  }

  return (

    <div className='container'>

      <h1 className='title'>
        Job Applicant Management System
      </h1>

      <input
        className='input'
        placeholder='Search by name'
        value={search}
        onChange={(e) =>
          setSearch(e.target.value)
        }
      />

      <br /><br />

      <select
        className='select'
        value={filterStatus}
        onChange={(e) =>
          setFilterStatus(
            e.target.value
          )
        }
      >

        <option value=''>
          All Status
        </option>

        <option value='Applied'>
          Applied
        </option>

        <option value='Interview'>
          Interview
        </option>

        <option value='Passed'>
          Passed
        </option>

        <option value='Rejected'>
          Rejected
        </option>

      </select>

      <br /><br />

      <select
        className='select'
        value={sortOrder}
        onChange={(e) =>
          setSortOrder(
            e.target.value
          )
        }
      >

        <option value='desc'>
          Latest First
        </option>

        <option value='asc'>
          Oldest First
        </option>

      </select>

      <br /><br />

      <div className='card'>

        <form onSubmit={handleSubmit}>

          <input
            className='input'
            name='name'
            placeholder='Name'
            value={form.name}
            onChange={handleChange}
          />

          <p className='error'>
            {errors.name}
          </p>

          <br />

          <input
            className='input'
            name='email'
            placeholder='Email'
            value={form.email}
            onChange={handleChange}
          />

          <p className='error'>
            {errors.email}
          </p>

          <br />

          <input
            className='input'
            name='phone'
            placeholder='Phone'
            value={form.phone}
            onChange={handleChange}
          />

          <p className='error'>
            {errors.phone}
          </p>

          <br />

          <input
            className='input'
            name='position'
            placeholder='Position'
            value={form.position}
            onChange={handleChange}
          />

          <p className='error'>
            {errors.position}
          </p>

          <br />

          <textarea
            className='textarea'
            name='note'
            placeholder='Note'
            value={form.note}
            onChange={handleChange}
          />

          <br /><br />

          <button
            type='submit'
            className='button save-btn'
          >

            {editingId
              ? 'Update'
              : 'Save'}

          </button>

        </form>

      </div>

      <hr />

      {loading ? (

        <p>Loading...</p>

      ) : (

        <>

          <table className='table'>

            <thead>

              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Position</th>
                <th>Status</th>
                <th>note</th>
                <th>created_at</th>
                <th>Action</th>
              </tr>

            </thead>

            <tbody>

  {paginatedApplicants.map((item) => (

    <tr key={item.id}>

      <td>{item.name}</td>

      <td>{item.email}</td>

      <td>{item.phone}</td>

      <td>{item.position}</td>

      {/* STATUS */}
      <td>

        <select
          className='status-select'
          value={item.status}
          onChange={(e) =>
            handleStatusChange(
              item.id,
              e.target.value
            )
          }
        >

          <option value='Applied'>
            Applied
          </option>

          <option value='Interview'>
            Interview
          </option>

          <option value='Passed'>
            Passed
          </option>

          <option value='Rejected'>
            Rejected
          </option>

        </select>

      </td>

      {/* NOTE */}
      <td className='note-cell'>
        {item.note}
      </td>

      {/* DATE */}
      <td className='date-cell'>

        {new Date(
          item.created_at
        ).toLocaleString()}

      </td>

      {/* ACTION */}
      <td>

        <div className='action-group'>

          <button
            className='button edit-btn'
            onClick={() =>
              handleEdit(item)
            }
          >
            Edit
          </button>

          <button
            className='button delete-btn'
            onClick={() =>
              handleDelete(item.id)
            }
          >
            Delete
          </button>

        </div>

      </td>

    </tr>

  ))}

</tbody>

          </table>

          <div
            style={{
              marginTop: '20px'
            }}
          >

            <button
              className='button'
              disabled={
                currentPage === 1
              }
              onClick={() =>
                setCurrentPage(
                  currentPage - 1
                )
              }
            >
              Prev
            </button>

            <span
              style={{
                margin: '0 10px'
              }}
            >
              Page {currentPage}
              {' '}
              of
              {' '}
              {totalPages}
            </span>

            <button
              className='button'
              disabled={
                currentPage ===
                totalPages
              }
              onClick={() =>
                setCurrentPage(
                  currentPage + 1
                )
              }
            >
              Next
            </button>

          </div>

        </>

      )}

    </div>
  );
}