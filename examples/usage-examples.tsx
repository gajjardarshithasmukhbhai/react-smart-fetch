import React from 'react';
import { useSmartFetch } from 'react-smart-fetch';

// Example 1: Simple GET request
export function UserProfile({ userId }: { userId: string }) {
  const { data, error, loading, refetch } = useSmartFetch(`/api/users/${userId}`, {
    cacheTime: 300000, // Cache for 5 minutes
  });

  if (loading) return <div>Loading user...</div>;
  if (error) return <div>Error: {error.message}</div>;
  if (!data) return <div>No user found</div>;

  return (
    <div>
      <h1>{data.name}</h1>
      <p>Email: {data.email}</p>
      <button onClick={refetch}>Refresh</button>
    </div>
  );
}

// Example 2: POST request to create a user
export function CreateUser() {
  const [userData, setUserData] = React.useState({ name: '', email: '' });
  
  const { data, error, loading, refetch } = useSmartFetch('/api/users', {
    method: 'POST',
    body: userData,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer your-token-here',
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    refetch(); // Manually trigger the POST request
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Name"
        value={userData.name}
        onChange={(e) => setUserData({ ...userData, name: e.target.value })}
      />
      <input
        type="email"
        placeholder="Email"
        value={userData.email}
        onChange={(e) => setUserData({ ...userData, email: e.target.value })}
      />
      <button type="submit" disabled={loading}>
        {loading ? 'Creating...' : 'Create User'}
      </button>
      {error && <div>Error: {error.message}</div>}
      {data && <div>User created: {JSON.stringify(data)}</div>}
    </form>
  );
}

// Example 3: PUT request to update a user
export function UpdateUser({ userId, initialData }: { userId: string; initialData: any }) {
  const [userData, setUserData] = React.useState(initialData);
  
  const { data, error, loading } = useSmartFetch(`/api/users/${userId}`, {
    method: 'PUT',
    body: userData,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  React.useEffect(() => {
    if (data) {
      alert('User updated successfully!');
    }
  }, [data]);

  return (
    <div>
      <input
        type="text"
        value={userData.name}
        onChange={(e) => setUserData({ ...userData, name: e.target.value })}
      />
      <input
        type="email"
        value={userData.email}
        onChange={(e) => setUserData({ ...userData, email: e.target.value })}
      />
      {loading && <div>Updating...</div>}
      {error && <div>Error: {error.message}</div>}
    </div>
  );
}

// Example 4: DELETE request
export function DeleteUser({ userId }: { userId: string }) {
  const { data, error, loading, refetch } = useSmartFetch(`/api/users/${userId}`, {
    method: 'DELETE',
  });

  const handleDelete = () => {
    if (confirm('Are you sure you want to delete this user?')) {
      refetch();
    }
  };

  return (
    <div>
      <button onClick={handleDelete} disabled={loading}>
        {loading ? 'Deleting...' : 'Delete User'}
      </button>
      {error && <div>Error: {error.message}</div>}
      {data && <div>User deleted successfully</div>}
    </div>
  );
}

// Example 5: Multiple requests with different cache times
export function Dashboard() {
  // Fast-changing data - short cache
  const { data: notifications } = useSmartFetch('/api/notifications', {
    cacheTime: 30000, // 30 seconds
  });

  // Slow-changing data - long cache
  const { data: userProfile } = useSmartFetch('/api/profile', {
    cacheTime: 600000, // 10 minutes
  });

  // Real-time data - no cache
  const { data: liveStats } = useSmartFetch('/api/stats/live', {
    cacheTime: 0, // No caching
  });

  return (
    <div>
      <h1>Dashboard</h1>
      <section>
        <h2>Notifications ({notifications?.length || 0})</h2>
        {/* Render notifications */}
      </section>
      <section>
        <h2>Profile</h2>
        {userProfile && <div>Welcome, {userProfile.name}!</div>}
      </section>
      <section>
        <h2>Live Stats</h2>
        {liveStats && <div>Active users: {liveStats.activeUsers}</div>}
      </section>
    </div>
  );
}

// Example 6: TypeScript usage with interface
interface User {
  id: number;
  name: string;
  email: string;
  avatar?: string;
}

export function TypedUserProfile({ userId }: { userId: string }) {
  const { data, error, loading } = useSmartFetch<User>(`/api/users/${userId}`);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  if (!data) return <div>No user found</div>;

  return (
    <div>
      <h1>{data.name}</h1>
      <p>ID: {data.id}</p>
      <p>Email: {data.email}</p>
      {data.avatar && <img src={data.avatar} alt={data.name} />}
    </div>
  );
}