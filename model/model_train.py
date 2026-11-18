import os
import pickle
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import StandardScaler

def train_and_save():
    # Base paths relative to the model folder
    base_dir = os.path.dirname(os.path.abspath(__file__))
    dataset_path = os.path.join(base_dir, '..', 'dataset', 'Titanic-Dataset.csv')

    # Load dataset
    df = pd.read_csv(dataset_path)

    # Select features and target
    features = ['Pclass', 'Sex', 'Age', 'SibSp', 'Parch', 'Fare', 'Embarked']
    X = df[features].copy()
    y = df['Survived']

    # Impute missing values
    X['Age'] = X['Age'].fillna(X['Age'].median())
    X['Fare'] = X['Fare'].fillna(X['Fare'].median())
    X['Embarked'] = X['Embarked'].fillna(X['Embarked'].mode()[0])

    # Encode categorical features
    X['Sex'] = X['Sex'].map({'male': 0, 'female': 1})
    X['Embarked'] = X['Embarked'].map({'S': 0, 'C': 1, 'Q': 2})

    # Train/Test Split
    X_train, _, y_train, _ = train_test_split(X, y, test_size=0.2, random_state=42)

    # Scale continuous numeric features
    scaler = StandardScaler()
    X_train_scaled = scaler.fit_transform(X_train)

    # Train Random Forest
    model = RandomForestClassifier(n_estimators=100, random_state=42)
    model.fit(X_train_scaled, y_train)

    # Export artifacts
    model_path = os.path.join(base_dir, 'model.pkl')
    scaler_path = os.path.join(base_dir, 'scaler.pkl')

    with open(model_path, 'wb') as f:
        pickle.dump(model, f)
    with open(scaler_path, 'wb') as f:
        pickle.dump(scaler, f)

    print("Model and Scaler trained and saved successfully.")

if __name__ == '__main__':
    train_and_save()