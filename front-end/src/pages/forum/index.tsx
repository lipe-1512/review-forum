import './Forum.css'
import { listAll } from '@/services/ForumService';


const forumData = [
  { title: 'Sample Title', author: 'John Doe', movie: 'Inception' },
  { title: 'Sample Title', author: 'John Doe', movie: 'Inception' },
  { title: 'Sample Title', author: 'John Doe', movie: 'Inception' },
  { title: 'Sample Title', author: 'John Doe', movie: 'Inception' },
  { title: 'Sample Title', author: 'John Doe', movie: 'Inception' },
  { title: 'Sample Title', author: 'John Doe', movie: 'Inception' },
];


let list = listAll()
console.log(list)

export default function Forum() {
  return (
    <div style={{ width:'100%', height:'100vh'}}>
      <table className='forum-table'>
        <thead>
            <tr>
                <th className="forum-table-title">Title</th>
                <th className="forum-table-title">Author</th>
                <th className="forum-table-title">Related Movie</th>
            </tr>
        </thead>
        <tbody>
            {forumData.map((item, index) => (
                <tr key={index}>
                    <td>{item.title}</td>
                    <td>{item.author}</td>
                    <td>{item.movie}</td>
                </tr>
            ))}
        </tbody>
      </table>
    </div>
    
  );

}