import { fetchUsers } from "../services/Supabase/UserServiceSB";
import { PostType, UserType } from "../utils/types/Types";
import { addPost, getPostByUserId } from "../services/Supabase/PostServiceSB";

class SupabaseComponent extends HTMLElement {
    private users: UserType[] = [];
    private posts: PostType[] = [];

    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    async connectedCallback() {
        try {
            this.users = await fetchUsers();
        } catch (error) {
            console.error('Error fetching users:', error);
        } finally {
            this.render();
        }
    }

    handleViewPost(userId: string) {
        getPostByUserId(userId).then((posts: PostType[]) => {
            this.posts = posts;
            console.log(`Posts for user ${userId}:`, this.posts, this.users);
            this.render();
            // You can add additional logic here to display the posts
        }).catch(() => {
            console.error(`Error fetching posts for user ${userId}:`);
        });
    }

    async render() {
        if (!this.shadowRoot) return;

        this.shadowRoot.innerHTML = `
            <style>
            /* Add your styles here */
            </style>
            <div>
            <h1>Supabase Component</h1>
            <p>List of Users:</p>
            <ul>
                ${this.users.map(user => `
                <li>
                    ${user.username}
                    <button data-user-id="${user.id}">Ver Post</button>
                    ${
                    this.posts.length > 0 && this.posts.some(post => post.userId === user.id)
                    ? `<ul>
                        ${this.posts.filter(post => post.userId === user.id).map(post => `
                        <li>${post.content} (Creado en: ${post.createdAt})</li>
                        `).join('')}
                        </ul>`
                    : ''
                    }
                </li>
                `).join('')}
            </ul>

            <h2>Form to Add Post</h2>
            <form id="postForm">
                <label for="userSelect">Select User:</label>
                <select id="userSelect" name="userSelect" required>
                <option value="">-- Select a User --</option>
                ${this.users.map(user => `
                    <option value="${user.id}">${user.username}</option>
                `).join('')}
                </select>
                <label for="content">Content:</label>
                <input type="text" id="content" name="content" required>
                <button type="submit">Add Post</button>
            </form>
            </div>
        `;

        this.shadowRoot.querySelectorAll('button[data-user-id]').forEach(button => {
            button.addEventListener('click', (event) => {
                const userId = (event.target as HTMLButtonElement).dataset.userId;
                if (userId) {
                    this.handleViewPost(userId);
                }
            });
        });

        const postForm = this.shadowRoot.querySelector('#postForm') as HTMLFormElement;
        if (postForm) {
            postForm.addEventListener('submit', async (event) => {
                event.preventDefault();

                const formData = new FormData(postForm);
                const formObject: Record<string, string> = {};
                formData.forEach((value, key) => {
                    formObject[key] = value.toString();
                });

                if (Object.keys(formObject).length > 0) {
                    console.log('Form Data:', formObject);
                    const postId = await addPost({
                        userId: formObject.userSelect,
                        content: formObject.content,
                    } as PostType);

                    postForm.reset();
                    if (postId) {
                        console.log('Post added with ID:', postId);
                    } else {
                        console.error('Error adding post.');
                    }
                } else {
                    console.error('El formulario está vacío.');
                }
            });
        }
    }
}

export default SupabaseComponent;