import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { toast } from 'react-hot-toast';
import { updateTask } from '../../../store/slices/taskSlice';
import type { RootState } from '../../../store';

export default function TaskReview() {
  const { taskId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const task = useSelector((state: RootState) =>
    state.tasks.items.find(t => t.id === taskId)
  );
  const [score, setScore] = React.useState('');

  if (!task) {
    return <div>Task not found</div>;
  }

  const getScoreColor = (scoreValue: number) => {
    if (scoreValue <= 25) return 'text-red-900';
    if (scoreValue <= 50) return 'text-red-600';
    if (scoreValue <= 65) return 'text-orange-500';
    if (scoreValue <= 75) return 'text-yellow-500';
    if (scoreValue <= 85) return 'text-yellow-300';
    if (scoreValue <= 95) return 'text-green-400';
    return 'text-green-600';
  };

  const handleSubmitScore = async () => {
    const scoreNum = parseInt(score);
    if (isNaN(scoreNum) || scoreNum < 0 || scoreNum > 100) {
      toast.error('Please enter a valid score between 0 and 100');
      return;
    }

    try {
      const updatedTask = {
        ...task,
        status: 'scored',
        score: scoreNum,
        updatedAt: new Date().toISOString(),
      };
      
      dispatch(updateTask(updatedTask));
      toast.success('Score submitted successfully');
      navigate('/admin/tasks');
    } catch (error) {
      toast.error('Failed to submit score');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Task Review
          </h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">
            Review submission and assign score
          </p>
        </div>
        
        <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
          <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">Title</dt>
              <dd className="mt-1 text-sm text-gray-900">{task.title}</dd>
            </div>
            
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">Status</dt>
              <dd className="mt-1 text-sm text-gray-900">{task.status}</dd>
            </div>

            <div className="sm:col-span-2">
              <dt className="text-sm font-medium text-gray-500">Submission</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {/* This would show the actual submission content */}
                <div className="prose max-w-none">
                  {task.description}
                </div>
              </dd>
            </div>

            <div className="sm:col-span-2">
              <dt className="text-sm font-medium text-gray-500">Score</dt>
              <dd className="mt-1">
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={score}
                  onChange={(e) => setScore(e.target.value)}
                  className="max-w-lg block w-full shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:max-w-xs sm:text-sm border-gray-300 rounded-md"
                />
                {score && (
                  <p className={`mt-2 text-sm ${getScoreColor(parseInt(score))}`}>
                    Score: {score}/100
                  </p>
                )}
              </dd>
            </div>
          </dl>
        </div>

        <div className="bg-gray-50 px-4 py-4 sm:px-6 flex justify-end space-x-3">
          <button
            type="button"
            onClick={() => navigate('/admin/tasks')}
            className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmitScore}
            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Submit Score
          </button>
        </div>
      </div>
    </div>
  );
}