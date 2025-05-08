import { Link } from 'react-router-dom';
import apiService from '../services/apiService';

function DocumentList() {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      setLoading(true);
      const data = await apiService.getDocuments();
      setDocuments(data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch documents. Please try again later.');
      console.error('Error fetching documents:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (window.confirm('Are you sure you want to delete this document?')) {
      try {
        await apiService.deleteDocument(id);
        fetchDocuments(); // Refresh the list
      } catch (err) {
        setError('Failed to delete document. Please try again.');
        console.error('Error deleting document:', err);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="text-xl text-gray-600">Loading documents...</div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Your Documents</h1>
        <Link
          to="/upload"
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Upload New Document
        </Link>
      </div>

      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6" role="alert">
          <p>{error}</p>
        </div>
      )}

      {documents.length === 0 ? (
        <div className="bg-white shadow rounded-lg p-6">
          <p className="text-gray-600">You haven't uploaded any documents yet.</p>
          <Link to="/upload" className="text-blue-600 hover:underline mt-2 inline-block">
            Upload your first document
          </Link>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {documents.map((document) => (
            <Link
              to={`/document/${document.id}`}
              key={document.id}
              className="bg-white shadow hover:shadow-md rounded-lg p-5 block transition duration-200"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-xl font-semibold text-gray-800 mb-2 truncate">
                    {document.title || document.filename}
                  </h2>
                  <p className="text-gray-600 text-sm mb-2 truncate">{document.filename}</p>
                  <p className="text-gray-500 text-xs">
                    Uploaded on {new Date(document.uploadedAt).toLocaleDateString()}
                  </p>
                </div>
                <button
                  onClick={(e) => handleDelete(document.id, e)}
                  className="text-red-500 hover:text-red-700"
                  title="Delete document"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default DocumentList;