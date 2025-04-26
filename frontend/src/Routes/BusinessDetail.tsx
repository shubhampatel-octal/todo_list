import { useNavigate, useParams } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { useAuth } from '../context';
import { useEffect, useState } from 'react';
import LocationModal from '../components/LocationModal';
import { IBusiness, LocationFormValues } from '../type';
import Button from '../components/ui/Button';
import BusinessModel from '../components/BusinessModel';
import { toast } from 'react-toastify';

const BusinessDetail = () => {
  const [business, setBusiness] = useState<IBusiness | null>(null);
  const [open, setOpen] = useState(false);
  const [openBusiness, setOpenBusiness] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const { user, setUser, businessData, setBusinessData } = useAuth();
  const { id } = useParams();
  const [itsEdit, setItsEdit] = useState(false);
  const [locationFormData, setLocationFormData] = useState<LocationFormValues>({
    address: '',
    state: '',
    city: '',
    country: '',
    pincode: '',
  });
  const navigate = useNavigate();

  useEffect(() => {
    setBusiness(businessData?.find((business) => business._id === id) || null);
  }, [id, businessData]);

  const handleEditBusiness = () => {
    setIsEdit(true);
    setOpenBusiness(true);
  };

  const handleBusinessDelete = async () => {
    const confirm = window.confirm('Are you sure you want to delete this business?');
    if (!confirm) return;

    try {
      const res = await fetch(`http://localhost:3000/business`, {
        method: 'DELETE',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ businessId: business?._id }),
      });
      const result = await res.json();

      if (res.status !== 200) return toast.error(result.msg);

      setBusinessData(businessData?.filter((business) => business._id !== id) || null);
      toast.success('Business deleted successfully');
      navigate('/business');
    } catch (err) {
      console.log(err);
      toast.error('Error deleting business');
    }
  };

  const handleEditLocation = (location: LocationFormValues) => {
    setItsEdit(true);
    setLocationFormData(location);
    setOpen(true);
  };

  const handleLocationDelete = async (locationId: string) => {
    const confirm = window.confirm('Are you sure you want to delete this location?');
    if (!confirm) return;

    try {
      const res = await fetch(`http://localhost:3000/business/location`, {
        method: 'DELETE',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ locationId, businessId: business?._id }),
      });
      const result = await res.json();

      if (res.status !== 200) return toast.error(result.msg);

      setBusinessData(
        (prev) =>
          prev?.map((business) => (business._id === id ? result.business : business)) || null
      );

      toast.success('Location deleted successfully');
    } catch (err) {
      console.log(err);
      toast.error('Error deleting location');
    }
  };

  const handleLogout = async () => {
    await fetch('http://localhost:3000/logout', {
      method: 'POST',
      credentials: 'include',
    });
    setUser(null);
  };

  return (
    <>
      <Sidebar />
      <div className="flex w-full justify-end">
        <div className="min-h-screen w-[85%] scroll-auto px-4 py-10">
          <section className="mx-auto w-full max-w-5xl rounded-xl bg-white px-6 py-6 shadow-lg transition-all duration-300 ease-in-out">
            <div className="flex items-center justify-between border-b border-gray-200 pb-4">
              <div className="text-xl font-semibold text-gray-700 capitalize">
                Welcome, {user?.username}
              </div>
              <button
                onClick={handleLogout}
                className="rounded-md border border-red-500 bg-red-500 px-3 py-1.5 text-sm font-medium text-white transition hover:bg-white hover:text-red-500"
              >
                Logout
              </button>
            </div>

            <div className="pt-6">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-2xl font-bold text-gray-800">Business Details</h3>
                <button
                  type="button"
                  className="rounded-full bg-yellow-500 px-6 py-2 text-sm font-semibold text-white capitalize shadow-md transition-all duration-300 hover:scale-105 hover:bg-yellow-600"
                  onClick={() => setOpenBusiness(true)}
                >
                  Create Business
                </button>
              </div>

              <div className="flex justify-between rounded-xl bg-white p-5 shadow-[0_3px_10px_rgb(0,0,0,0.2)]">
                <div className="flex items-center gap-6">
                  <img
                    src={business?.imgLink}
                    alt={business?.name}
                    className="h-32 w-32 rounded-full object-cover shadow-sm"
                  />
                  <div className="space-y-1 text-gray-700">
                    <div className="text-lg font-semibold">{business?.name}</div>
                    <div className="text-sm">Owner: {business?.ownerName}</div>
                    <div className="text-sm">Phone: {business?.phoneNumber}</div>
                    <div className="text-sm">Email: {business?.email}</div>
                  </div>
                </div>
                {user?._id === business?.userId && (
                  <div className="flex flex-col gap-2">
                    <Button
                      type="button"
                      className="flex w-full items-center justify-center gap-2 bg-yellow-500 text-white shadow-md transition-all duration-300 hover:scale-105 hover:bg-yellow-600"
                      onClick={handleEditBusiness}
                    >
                      Edit Business
                    </Button>
                    <Button
                      type="button"
                      onClick={handleBusinessDelete}
                      className="flex w-full items-center justify-center gap-2 bg-red-500 text-white shadow-md transition-all duration-300 hover:scale-105 hover:bg-red-600"
                    >
                      Delete
                    </Button>
                  </div>
                )}
              </div>

              <div className="mt-5 flex flex-col justify-center gap-6 rounded-xl bg-white p-5 shadow-[0_3px_10px_rgb(0,0,0,0.2)]">
                <div className="flex items-center justify-between">
                  <h3 className="text-2xl font-bold">Location</h3>
                  <button
                    type="button"
                    onClick={() => setOpen(true)}
                    className="rounded-full bg-yellow-500 px-6 py-2 text-sm font-semibold text-white capitalize shadow-md transition-all duration-300 hover:scale-105 hover:bg-yellow-600"
                  >
                    Add Location
                  </button>
                </div>
                {business?.locations?.length ? (
                  <div className="space-y-2">
                    {business?.locations?.map((location, index) => (
                      <div
                        className="rounded-md border border-gray-300 p-3 text-gray-700"
                        key={index}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            {location.address}, {location.city}, {location.state},{' '}
                            {location.country} - {location.pincode}
                          </div>
                          <div>
                            <div className="flex gap-2">
                              {(user?._id === business?.userId ||
                                user?._id === location.userId) && (
                                <Button
                                  type="button"
                                  className="flex w-full items-center justify-center gap-2 bg-yellow-500 text-white shadow-md transition-all duration-300 hover:scale-105 hover:bg-yellow-600"
                                  onClick={() => handleEditLocation(location)}
                                >
                                  Edit
                                </Button>
                              )}
                              {user?._id === business?.userId && (
                                <Button
                                  type="button"
                                  onClick={() => handleLocationDelete(location._id)}
                                  className="flex w-full items-center justify-center gap-2 bg-red-500 text-white shadow-md transition-all duration-300 hover:scale-105 hover:bg-red-600"
                                >
                                  Delete
                                </Button>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex justify-center space-y-1 text-lg text-gray-700">
                    No Location Added
                  </div>
                )}
              </div>
            </div>
          </section>
        </div>
      </div>
      <LocationModal
        open={open}
        setOpen={setOpen}
        formData={locationFormData}
        setFormData={setLocationFormData}
        businessId={id || ''}
        itsEdit={itsEdit}
        setItsEdit={setItsEdit}
      />
      <BusinessModel
        open={openBusiness}
        setOpen={setOpenBusiness}
        businessToEdit={isEdit ? business : null}
        setBusinessData={setBusinessData}
        setIsEdit={setIsEdit}
      />
    </>
  );
};

export default BusinessDetail;
