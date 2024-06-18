# Social Media Microservices Architecture

This repository contains the implementation of a social media application using a microservices architecture. The system includes User Service, Post Service, Auth Service, and a Common Module shared across services. An API Gateway routes requests to the appropriate services.

## Microservices Overview


### 1. API Gateway
The API Gateway acts as the single entry point for all client requests. It routes requests to the appropriate microservice based on the request path and method using a proxy.

### 2. User Service
The User Service manages user profiles, including user registration, profile updates, following/unfollowing users, and searching for users.

### 3. Post Service
The Post Service handles creating, updating, deleting, and retrieving posts. It also manages comments on posts, as well as liking and replying to comments.

### 4. Auth Service
The Auth Service handles user authentication, including login, logout, and token validation.

### 5. Common Module
The Common Module contains shared models and utility functions used across all services, such as database connection logic, user and post schemas, and authentication utilities.

## API Documentation

The full API documentation for all services can be found in the following Google Doc:
[API Documentation](https://docs.google.com/document/d/1hYh878Xupkyxa-hD8eXEW69MkrhzxFCq2DI5IUX20lE/edit?usp=sharing)

## Low-Level Design (LLD)

The Low-Level Design (LLD) for the entire system, including all microservices, can be accessed using the following link:
[Low-Level Design](https://drive.google.com/file/d/13iKCdUIHw1AknrF0s6A1DDDT6gyL9xAI/view?usp=sharing)

## Database Design

The Database Design, including schema diagrams and relationships, can be found here:
[Database Design](https://drive.google.com/file/d/1JqynzCe7Qg2f19x6FCIvs4n63zXtg_Bd/view?usp=sharing)

## Postman Link
[Postman] (https://www.postman.com/payload-pilot-88591702/workspace/my-workspace/collection/36369191-fb86cd45-fa22-43df-9ff0-c9928dc776ce?action=share&creator=36369191)

## Getting Started

### Prerequisites

- Node.js
- MongoDB
- Express
- Cloudinary account (for image uploads)

