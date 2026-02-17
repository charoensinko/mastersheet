@echo off
git remote remove origin 2>nul
git remote add origin https://github.com/charoensinko/mastersheet.git
git branch -M main
git pull origin main --allow-unrelated-histories
