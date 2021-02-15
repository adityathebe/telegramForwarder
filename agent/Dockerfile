FROM python:3.8-rc-buster

RUN apt-get clean && \
  rm -rf /var/lib/apt/lists/* && \
  apt-get clean && \
  apt-get update

RUN apt-get install python-dev default-libmysqlclient-dev -y

WORKDIR /telegram-python-agent

COPY requirements.txt .

RUN pip install -r requirements.txt

COPY . .

CMD ["python", "server.py"]