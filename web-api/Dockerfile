# Anyberry API image
FROM python:3.9

# cd into /app
WORKDIR /app

RUN pip install --upgrade pip

# Copy requirements to the working directory
COPY ./requirements.txt .

# Install all dependencies
RUN pip install -r requirements.txt

# Copy entrypoint bash script
COPY ./entrypoint.sh .

# Copy all other files to the container
COPY ./ .

# Run entrypoint script before running the main container command
ENTRYPOINT [ "/app/entrypoint.sh" ]