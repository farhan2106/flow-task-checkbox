# Flow Task Management by Farhan

## Potential Risk To Mitigate:

- Implement thorough error handling mechanisms to handle potential errors during task creation, editing, and listing.
- Incorporate input validation to ensure data integrity and prevent unexpected behavior.
- Use defensive programming techniques to handle edge cases and unexpected inputs gracefully.

## Design Decisions:

- Utilize Onion architecture to maintain separation of concerns and facilitate modularity, making the application more maintainable and scalable.
- Implement Domain-Driven Design principles to model the core business logic and entities effectively.
- Opt for unit testing to ensure the reliability and robustness of individual components, following test-driven development (TDD) practices where applicable.

## Further Improvements, if I have more time:

- Implement pagination for the task list view to improve performance and user experience when dealing with a large number of tasks.
- Enhance the frontend interface with responsive design to ensure usability across different devices and screen sizes.
- Implement user authentication and authorization mechanisms to secure access to task management functionalities.
- Integrate automated end-to-end testing to validate the entire application flow and ensure seamless functionality across all layers.

## How to Start

- Need to run `npm i` in `frontend` and `api-server` (Not sure why this is happening)
- Rename `.env.sample` to `.env` and populate the env values. 
- `docker compose up`
- `docker compose down --volumes` -- when you want to start over with new database
