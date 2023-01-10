import { useParams } from 'react-router-dom';
import cn from 'classnames';
import { useQueryClient } from '@tanstack/react-query';
import { useFetchPeople } from '../../hooks/useFetchPeople';
import { PersonLink } from '../PersonLink';
import { Loader } from '../Loader';
import { Person } from '../../types/Person';

export const PeopleTable = () => {
  const { people: peopleFromServer, isLoading, isFetching } = useFetchPeople();
  const { slug } = useParams<{ slug: string }>();

  const queryClient = useQueryClient();

  const peopleFromCache = queryClient.getQueryData<Person[]>(['people']);

  const people = isFetching ? peopleFromCache : peopleFromServer;

  if (isLoading) {
    return <Loader />;
  }

  return (
    <table
      data-cy="peopleTable"
      className="table is-striped is-hoverable is-narrow is-fullwidth"
    >
      <thead>
        <tr>
          <th>Name</th>
          <th>Sex</th>
          <th>Born</th>
          <th>Died</th>
          <th>Mother</th>
          <th>Father</th>
        </tr>
      </thead>

      <tbody>
        {
          // eslint-disable-next-line
          people &&
            people.map((person) => (
              <tr
                data-cy="person"
                key={person.slug}
                className={cn({
                  'has-background-warning': person.slug === slug,
                })}
              >
                <td>
                  <PersonLink person={person} />
                </td>

                <td>{person.sex}</td>
                <td>{person.born}</td>
                <td>{person.died}</td>
                <td>
                  {person.mother ? (
                    <PersonLink person={person.mother} />
                  ) : (
                    <span className="has-text-grey">
                      {person.motherName || '-'}
                    </span>
                  )}
                </td>
                <td>
                  {person.father ? (
                    <PersonLink person={person.father} />
                  ) : (
                    <span className="has-text-grey">
                      {person.fatherName || '-'}
                    </span>
                  )}
                </td>
              </tr>
            ))
        }
      </tbody>
    </table>
  );
};
