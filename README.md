# Realtime chat application

We all expect online experiences to happen in real-time. Messages should arrive instantly, dashboards should deliver business metrics as they happen, and live sports scores should be broadcast to fans worldwide in a blink.

This expectation is even higher for real-time chat and messaging, now embedded in everything from e-commerce platforms to online gaming. But building a competitive instant messaging or live chat app requires some heavy lifting. And here is How I could develop my chat app from scratch

**What the functionalities :** 

1. **User Login**: Users can log into the chat system with a username.
2. **Message Sending:** Logged-in users have the ability to send messages to other users.
3. **Real-time Message Reception**: Users receive messages from other users in real time without needing to refresh the page.
4. **Notifications**: Users are notified when a new message is received.
5. **List of Connected Users**: The system displays a list of currently connected users.
6. **Group and friends management:**  you can manage your groups and friends, and add new members to your group.

**What Did I use for this project?** 

**SignalR** is a library for [ASP.NET](http://asp.net/) developers that simplifies the process of adding real-time web functionality to applications

***Node.js*** is a  server environment. to handle the app logic (auth, user management, group management …) 

**Next Js** enables you to create full-stack Web applications

***Redis***  in-memory data structure store is used as a database, cache, and message broker

**Docker** to containerize the application, and make it easy to ship, deploy …

**GitHub Actions** to setup ci/cd and **git** for version control 


- I’ve mainly used the **observer design pattern** to define a subscription mechanism to notify multiple users in the same channel about any events.

- and also the singleton pattern to maintain one connection per user with my server.

**Source code :**

This repository contains the logic of the real-time subscription and event-based system (for notifications, and messages …)

**************SignalR, C#, DotNet, Redis, Docker, Github Actions**************

[https://github.com/sohaibMan/pusherSignalR](https://github.com/sohaibMan/pusherSignalR)

And this repository contains the client logic, with the back-end logic of the core of the app

**NextJs , Nodjs, Tailwind Css  ..**

[https://github.com/sohaibMan/FriendZone](https://github.com/sohaibMan/FriendZone)

**Made by :**  [Sohaib manah](https://sohaibmanah.netlify.app/)

[https://www.linkedin.com/in/sohaibmanah/](https://www.linkedin.com/in/sohaibmanah/)


**Demo:** [Friends zone](https://friendszone.vercel.app/)

![Untitled](Realtime%20chat%20application%2027c762518ab7473491b251f3d1653ea5/Untitled.png)

![Untitled](Realtime%20chat%20application%2027c762518ab7473491b251f3d1653ea5/Untitled%201.png)

![Untitled](Realtime%20chat%20application%2027c762518ab7473491b251f3d1653ea5/Untitled%202.png)

************************************************How to install the app :************************************************

Setup the server 

```bash
## Clone the repo
git clone https://github.com/sohaibMan/pusherSignalR
## cd into the pusherSignalR directory 
cd pusherSignalR
## Create a .env file with the required fields 
cp .env.example .env.local
## open your project with visual studio code or rider , white for the dependicies to be install and the run the server 
## enjoy !
```

Setup the client 

```bash
## Clone the repo
git clone https://github.com/sohaibMan/FriendZone.git 
## cd into the FriendZone directory 
cd FriendZone
## Create a .env file with the required fields 
cp .env.example .env.local
## Install the dependicies 
npm i
## Run the server
npm run dev
```
