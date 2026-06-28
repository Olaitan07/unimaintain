import React from 'react';

export default function RequestCard({ request }: { request: any }) {
  return (
    <div>
      <h3>{request.title}</h3>
      <span>{request.status}</span>
    </div>
  );
}
