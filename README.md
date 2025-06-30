## Проект 3d_house(docker-версия)

Структура проекта:
```
project-root/
├── backend/            # Laravel (api-only)
│   └── laravel/
│       └── ...
├── frontend/           # Vue
│   └── app/
│       └── ...
├── docker/
│   └── dockerfiles/    # Dockerfiles
│   └── nginx/          # nginx.conf
│   └── env/            # .env файлы
├── docker-compose.yml
├── README.md
└── .gitignore
```

Для работы с проектом, необходимо чтобы на вашей машине было установлено docker desktop.
И последовательно выполнить команды:

git clone ...

cp backend/.env.example backend/.env

cp frontend/app/.env.example frontend/app/.env

docker compose up --build
