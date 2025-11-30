from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from .. import crud, schemas, database, auth

router = APIRouter(
    prefix="/news",
    tags=["news"]
)

@router.post("/", response_model=schemas.News)
def create_news(
    news: schemas.NewsCreate,
    db: Session = Depends(database.get_db),
    current_user: schemas.User = Depends(auth.get_current_active_user)
):
    return crud.create_news(db=db, news=news, user_id=current_user.id)

@router.get("/", response_model=List[schemas.News])
def read_news(skip: int = 0, limit: int = 100, db: Session = Depends(database.get_db)):
    news = crud.get_news_list(db, skip=skip, limit=limit)
    return news

@router.get("/{news_id}", response_model=schemas.News)
def read_news_item(news_id: int, db: Session = Depends(database.get_db)):
    db_news = crud.get_news(db, news_id=news_id)
    if db_news is None:
        raise HTTPException(status_code=404, detail="News not found")
    return db_news

@router.delete("/{news_id}")
def delete_news(
    news_id: int,
    db: Session = Depends(database.get_db),
    current_user: schemas.User = Depends(auth.get_current_active_user)
):
    db_news = crud.delete_news(db, news_id=news_id)
    if db_news is None:
        raise HTTPException(status_code=404, detail="News not found")
    return {"ok": True}
