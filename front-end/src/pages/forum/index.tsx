import './Forum.css'
import { listAll } from '@/services/ForumService';


let forumData: any[] = []

let list = await listAll()

forumData = list


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
                    <td className='forum-name'>{item.title}</td>
                    <td className='forum-username'>{item.username}</td>
                    <td className='forum-related_movie-name'>{item.related_movie.name}</td>
                </tr>
            ))}
        </tbody>
      </table>
    </div>
    
  );

}